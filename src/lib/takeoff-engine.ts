// Australian standard sheet and material sizes
export const AU_SHEET = { width: 2400, height: 1200 }; // mm
export const AU_EDGE_ROLL = 50_000; // 50m roll in mm

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

// Calculate the number of panels that fit on a single sheet
function panelsPerSheet(panelW: number, panelH: number): number {
  const { width: sw, height: sh } = AU_SHEET;
  // Try both orientations
  const option1 = Math.floor(sw / panelW) * Math.floor(sh / panelH);
  const option2 = Math.floor(sw / panelH) * Math.floor(sh / panelW);
  return Math.max(option1, option2, 1);
}

function sheetsNeeded(panelCount: number, panelW: number, panelH: number): number {
  const perSheet = panelsPerSheet(panelW, panelH);
  return Math.ceil(panelCount / perSheet);
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

export function calculateTakeoff(
  cabinets: Cabinet[],
  wasteFactor: Partial<typeof DEFAULT_WASTE_FACTORS> = {}
): TakeoffResult {
  const wf = { ...DEFAULT_WASTE_FACTORS, ...wasteFactor };
  const items: TakeoffLineItem[] = [];

  let totalCarcassPanels = 0;
  let totalDoorPanels = 0;
  let totalShelfPanels = 0;
  let totalEdge_mm = 0;
  let totalHinges = 0;
  let totalDrawerRunners = 0;
  let totalShelves = 0;

  for (const cab of cabinets) {
    const { width_mm: w, height_mm: h, depth_mm: d, type } = cab;
    const doors = cab.door_count ?? (type === "base" || type === "wall" ? (w > 600 ? 2 : 1) : 1);
    const drawers = cab.drawer_count ?? 0;
    const shelves = cab.shelf_count ?? (type === "wall" ? 2 : type === "tall" ? 4 : 1);

    // --- Carcass panels ---
    // 2 sides + top + bottom + back
    const sidePanels = 2; // d × h each
    const topBottomPanels = 2; // w × d each
    const backPanel = 1; // w × h (usually 3mm ply but we count it)

    // Track panel sizes for sheet calculation
    totalCarcassPanels += sidePanels + topBottomPanels + backPanel;

    // --- Doors / Drawer fronts ---
    totalDoorPanels += doors + drawers;

    // --- Shelves ---
    totalShelves += shelves;
    totalShelfPanels += shelves;

    // --- Edge banding ---
    // Front edges of shelves + top/bottom exposed edges
    const shelfEdge = shelves * w * 2; // front + back
    const carcassEdge = (w + d) * 2; // top/bottom exposed
    const doorEdge = doors * (w / doors + h) * 2; // each door perimeter approx
    totalEdge_mm += shelfEdge + carcassEdge + doorEdge;

    // --- Hardware ---
    // 2 hinges per door, pair of runners per drawer
    totalHinges += doors * 2;
    totalDrawerRunners += drawers; // pairs
  }

  // Calculate sheets using average panel sizes from the cabinets
  const avgCab = cabinets.length > 0
    ? {
        w: cabinets.reduce((s, c) => s + c.width_mm, 0) / cabinets.length,
        h: cabinets.reduce((s, c) => s + c.height_mm, 0) / cabinets.length,
        d: cabinets.reduce((s, c) => s + c.depth_mm, 0) / cabinets.length,
      }
    : { w: 600, h: 720, d: 560 };

  const carcassSheets = sheetsNeeded(totalCarcassPanels, avgCab.d, avgCab.h);
  const doorSheets = sheetsNeeded(totalDoorPanels, avgCab.w, avgCab.h);
  const shelfSheets = sheetsNeeded(totalShelfPanels, avgCab.w, avgCab.d);
  const edgeBanding_m = Math.ceil(totalEdge_mm / 1000);

  // Build line items
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
