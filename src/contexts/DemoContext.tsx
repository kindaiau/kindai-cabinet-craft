import { createContext, useContext, useState, type ReactNode } from "react";

// ── Mock Data ──────────────────────────────────────────
export const DEMO_PROJECT = {
  id: "demo-project-1",
  name: "Kitchen Renovation — 42 Oak Ave",
  status: "active",
  client_name: "Sarah Mitchell",
  client_email: "sarah@example.com.au",
  client_phone: "0412 345 678",
  address: "42 Oak Avenue, Richmond VIC 3121",
  notes: "Modern handleless kitchen, stone benchtops, Polytec carcass",
  created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_CABINETS = [
  { label: "B1 — Sink Base", type: "base", width_mm: 900, height_mm: 720, depth_mm: 560, door_count: 2, drawer_count: 0, shelf_count: 1, features: ["sink cutout", "plumbing access"] },
  { label: "B2 — Drawer Bank", type: "base", width_mm: 600, height_mm: 720, depth_mm: 560, door_count: 0, drawer_count: 4, shelf_count: 0, features: ["soft-close runners"] },
  { label: "B3 — Corner Base", type: "base", width_mm: 900, height_mm: 720, depth_mm: 560, door_count: 1, drawer_count: 0, shelf_count: 2, features: ["lazy susan", "corner access"] },
  { label: "B4 — Standard Base", type: "base", width_mm: 600, height_mm: 720, depth_mm: 560, door_count: 1, drawer_count: 1, shelf_count: 1, features: [] },
  { label: "W1 — Rangehood Cabinet", type: "wall", width_mm: 600, height_mm: 360, depth_mm: 330, door_count: 0, drawer_count: 0, shelf_count: 0, features: ["rangehood housing"] },
  { label: "W2 — Wall Cabinet L", type: "wall", width_mm: 800, height_mm: 720, depth_mm: 330, door_count: 2, drawer_count: 0, shelf_count: 2, features: ["adjustable shelves"] },
  { label: "W3 — Wall Cabinet R", type: "wall", width_mm: 600, height_mm: 720, depth_mm: 330, door_count: 1, drawer_count: 0, shelf_count: 2, features: ["adjustable shelves"] },
  { label: "T1 — Pantry Tower", type: "tall", width_mm: 600, height_mm: 2100, depth_mm: 560, door_count: 2, drawer_count: 0, shelf_count: 5, features: ["pull-out baskets"] },
];

export const DEMO_PLAN = {
  id: "demo-plan-1",
  file_name: "Kitchen-FloorPlan-42Oak.pdf",
  file_path: "demo/kitchen-plan.pdf",
  file_type: "application/pdf",
  file_size: 2_450_000,
  status: "analyzed",
  created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
  analysis: {
    summary: "Modern L-shaped kitchen — 8 cabinets detected",
    room_type: "kitchen",
    cabinets: DEMO_CABINETS,
    total_linear_metres: 5.6,
    estimated_carcass_sheets: 7,
    notes: "Stone benchtop not included in cabinet count",
  },
};

export const DEMO_MATERIALS = [
  { id: "m1", name: "18mm White Melamine Board", category: "Carcass", unit: "sheet", unit_price: 89.0, supplier: "Polytec" },
  { id: "m2", name: "16mm Doors — Bayliss Oak", category: "Doors & Fronts", unit: "sheet", unit_price: 145.0, supplier: "Polytec" },
  { id: "m3", name: "ABS Edge Tape 1mm White", category: "Edge Banding", unit: "m", unit_price: 0.85, supplier: "Hafele" },
  { id: "m4", name: "Blum Clip-Top Hinge", category: "Hardware", unit: "ea", unit_price: 12.5, supplier: "Hafele" },
  { id: "m5", name: "Blum Tandembox Antaro 500mm", category: "Hardware", unit: "set", unit_price: 68.0, supplier: "Hafele" },
  { id: "m6", name: "Adjustable Shelf Supports", category: "Hardware", unit: "pk", unit_price: 4.2, supplier: "Bunnings" },
];

// ── Tour Steps ─────────────────────────────────────────
export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

export const TOUR_STEPS: TourStep[] = [
  { target: "[data-tour='dashboard']", title: "Project Dashboard", content: "All your jobs in one place. Create projects, track status, and manage client details.", position: "right" },
  { target: "[data-tour='upload']", title: "Upload Plans", content: "Drag & drop floor plans, elevations, or sketches. Supports any file type up to 5GB with resumable uploads.", position: "right" },
  { target: "[data-tour='takeoff']", title: "Material Take-Off", content: "AI extracts cabinets and calculates every material — sheets, hardware, edge banding — to AU standards.", position: "right" },
  { target: "[data-tour='quotes']", title: "Quote Builder", content: "Generate professional quotes with labour costing, GST, and export as PDF — or email directly to your client.", position: "right" },
];

// ── Context ────────────────────────────────────────────
interface DemoContextType {
  isDemo: boolean;
  tourStep: number;
  setTourStep: (step: number) => void;
  tourActive: boolean;
  setTourActive: (active: boolean) => void;
}

const DemoContext = createContext<DemoContextType>({
  isDemo: false,
  tourStep: 0,
  setTourStep: () => {},
  tourActive: false,
  setTourActive: () => {},
});

export const useDemo = () => useContext(DemoContext);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [tourStep, setTourStep] = useState(0);
  const [tourActive, setTourActive] = useState(true);

  return (
    <DemoContext.Provider value={{ isDemo: true, tourStep, setTourStep, tourActive, setTourActive }}>
      {children}
    </DemoContext.Provider>
  );
}
