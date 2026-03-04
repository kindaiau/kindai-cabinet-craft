// Australian standard sheet and material sizes
export const AU_SHEET = { width: 2400, height: 1200 }; // mm
export const AU_EDGE_ROLL = 50_000; // 50m roll in mm

const AU_SHEET_AREA = AU_SHEET.width * AU_SHEET.height;

// Default waste factors by category (%)
export const DEFAULT_WASTE_FACTORS: Record<string, number> = {
  carcass: 12,
  doors: 10,
  shelves: 8,
  edgeBanding: 15,
  hardware: 5,
};

export interface Cabinet {
  label: string;
  type: string;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  door_count?: number;
  drawer_count?: number;
  shelf_count?: number;
  features?: string[];
}

export interface TakeoffLineItem {
  category: string;
  description: string;
  rawQty: number;
  unit: string;
  wastePercent: number;
  adjustedQty: number;
}

export interface TakeoffResult {
  cabinets: Cabinet[];
  lineItems: TakeoffLineItem[];
  summary: {
    totalCarcassSheets: number;
    totalDoorSheets: number;
    totalShelfSheets: number;
    totalEdgeBanding_m: number;
    totalHinges: number;
    totalDrawerRunners: number;
    totalShelves: number;
  };
}

function withWaste(qty: number, wastePercent: number): number {
  return Math.ceil(qty * (1 + wastePercent / 100));
}

function addItem(
  items: TakeoffLineItem[],
  category: string,
  description: string,
  rawQty: number,
  unit: string,
  wastePercent: number
) {
  if (rawQty <= 0) return;
  items.push({
    category,
    description,
    rawQty,
    unit,
    wastePercent,
    adjustedQty: withWaste(rawQty, wastePercent),
  });
}

function areaToSheets(areaMm2: number): number {
  return Math.ceil(areaMm2 / AU_SHEET_AREA);
}

export function calculateTakeoff(
  cabinets: Cabinet[],
  wasteFactor: Partial<typeof DEFAULT_WASTE_FACTORS> = {}
): TakeoffResult {
  const wf = { ...DEFAULT_WASTE_FACTORS, ...wasteFactor };
  const items: TakeoffLineItem[] = [];

  let totalCarcassArea = 0;
  let totalDoorArea = 0;
  let totalShelfArea = 0;
  let totalEdge_mm = 0;
  let totalHinges = 0;
  let totalDrawerRunners = 0;
  let totalShelves = 0;

  for (const cab of cabinets) {
    const { width_mm: w, height_mm: h, depth_mm: d, type } = cab;

    const doors = cab.door_count ?? (type === "base" || type === "wall" ? (w > 600 ? 2 : 1) : 1);
    const drawers = cab.drawer_count ?? 0;
    const shelves = cab.shelf_count ?? (type === "wall" ? 2 : type === "tall" ? 4 : 1);

    // --- Carcass board area (mm²) ---
    // 2 sides (d × h) + top/bottom (w × d) + back (w × h)
    totalCarcassArea += 2 * d * h + 2 * w * d + w * h;

    // --- Door + drawer front area (mm²) ---
    const doorLeafArea = doors > 0 ? (w / doors) * h : 0;
    const drawerFrontHeight = 180; // practical default; can be replaced by model output later
    const drawerFrontArea = drawers > 0 ? (w / drawers) * drawerFrontHeight : 0;
    totalDoorArea += doors * doorLeafArea + drawers * drawerFrontArea;

    // --- Shelves area (mm²) ---
    totalShelves += shelves;
    totalShelfArea += shelves * w * d;

    // --- Edge banding (mm) ---
    const shelfEdge = shelves * w * 2; // front + back
    const carcassEdge = (w + d) * 2; // exposed top/bottom edges
    const doorEdge = doors > 0 ? doors * ((w / doors + h) * 2) : 0; // door perimeters
    totalEdge_mm += shelfEdge + carcassEdge + doorEdge;

    // --- Hardware ---
    totalHinges += doors * 2;
    totalDrawerRunners += drawers; // one pair per drawer
  }

  const carcassSheets = areaToSheets(totalCarcassArea);
  const doorSheets = areaToSheets(totalDoorArea);
  const shelfSheets = areaToSheets(totalShelfArea);
  const edgeBanding_m = Math.ceil(totalEdge_mm / 1000);

  addItem(items, "Carcass", "16mm White Melamine (2400×1200)", carcassSheets, "sheet", wf.carcass);
  addItem(items, "Doors & Fronts", "18mm Door Board (2400×1200)", doorSheets, "sheet", wf.doors);
  addItem(items, "Shelves", "16mm Melamine Shelf Board (2400×1200)", shelfSheets, "sheet", wf.shelves);
  addItem(items, "Edge Banding", "PVC Edge Tape 21mm", edgeBanding_m, "m", wf.edgeBanding);
  addItem(items, "Hardware", "Soft-Close Hinges", totalHinges, "ea", wf.hardware);
  addItem(items, "Hardware", "Drawer Runner Pairs (450mm)", totalDrawerRunners, "pair", wf.hardware);

  return {
    cabinets,
    lineItems: items,
    summary: {
      totalCarcassSheets: withWaste(carcassSheets, wf.carcass),
      totalDoorSheets: withWaste(doorSheets, wf.doors),
      totalShelfSheets: withWaste(shelfSheets, wf.shelves),
      totalEdgeBanding_m: withWaste(edgeBanding_m, wf.edgeBanding),
      totalHinges: withWaste(totalHinges, wf.hardware),
      totalDrawerRunners: withWaste(totalDrawerRunners, wf.hardware),
      totalShelves,
    },
  };
}
