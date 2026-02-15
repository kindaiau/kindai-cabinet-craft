/**
 * Labour estimation engine for Australian cabinet makers.
 * Supports hourly, per-linear-metre, and per-unit pricing methods
 * with separate fabrication and installation rates.
 */

export type LabourMethod = "hourly" | "per_lm" | "per_unit";

export type CabinetType = "base" | "wall" | "tall" | "drawer_bank";

/** Hours per cabinet type for fabrication & installation */
export interface HoursPerUnit {
  base: number;
  wall: number;
  tall: number;
  drawer_bank: number;
}

/** Fixed $ per cabinet type for fabrication & installation */
export interface PricePerUnit {
  base: number;
  wall: number;
  tall: number;
  drawer_bank: number;
}

export interface LabourConfig {
  method: LabourMethod;
  fabHourlyRate: number;
  installHourlyRate: number;
  fabPerLm: number;
  installPerLm: number;
  fabPerUnit: PricePerUnit;
  installPerUnit: PricePerUnit;
  fabHoursPerUnit: HoursPerUnit;
  installHoursPerUnit: HoursPerUnit;
}

export const DEFAULT_LABOUR_CONFIG: LabourConfig = {
  method: "hourly",
  fabHourlyRate: 65,
  installHourlyRate: 75,
  fabPerLm: 350,
  installPerLm: 180,
  fabPerUnit: { base: 130, wall: 100, tall: 200, drawer_bank: 180 },
  installPerUnit: { base: 65, wall: 50, tall: 100, drawer_bank: 90 },
  fabHoursPerUnit: { base: 2, wall: 1.5, tall: 3.5, drawer_bank: 3 },
  installHoursPerUnit: { base: 0.75, wall: 0.5, tall: 1.25, drawer_bank: 1 },
};

export interface CabinetInput {
  type: string;
  width_mm: number;
  quantity?: number;
}

export interface LabourBreakdown {
  fabTotal: number;
  installTotal: number;
  fabHours: number;
  installHours: number;
  fabLineLabel: string;
  installLineLabel: string;
  details: LabourDetailLine[];
}

export interface LabourDetailLine {
  cabinetType: string;
  count: number;
  fabCost: number;
  installCost: number;
}

/** Map free-form cabinet type strings to our known categories */
function normaliseCabinetType(raw: string): CabinetType {
  const lower = raw.toLowerCase();
  if (lower.includes("tall") || lower.includes("pantry")) return "tall";
  if (lower.includes("wall") || lower.includes("overhead")) return "wall";
  if (lower.includes("drawer")) return "drawer_bank";
  return "base";
}

/**
 * Calculate total linear metres from cabinet widths.
 */
function totalLinearMetres(cabinets: CabinetInput[]): number {
  return cabinets.reduce((sum, c) => sum + (c.width_mm * (c.quantity ?? 1)) / 1000, 0);
}

/**
 * Calculate labour costs for a set of cabinets.
 */
export function calculateLabour(
  cabinets: CabinetInput[],
  config: LabourConfig
): LabourBreakdown {
  const { method } = config;

  if (method === "per_lm") {
    const lm = totalLinearMetres(cabinets);
    const roundedLm = Math.round(lm * 100) / 100;
    return {
      fabTotal: Math.round(roundedLm * config.fabPerLm * 100) / 100,
      installTotal: Math.round(roundedLm * config.installPerLm * 100) / 100,
      fabHours: 0,
      installHours: 0,
      fabLineLabel: `Fabrication labour (${roundedLm.toFixed(2)} LM × $${config.fabPerLm}/LM)`,
      installLineLabel: `Installation labour (${roundedLm.toFixed(2)} LM × $${config.installPerLm}/LM)`,
      details: [],
    };
  }

  // Group cabinets by normalised type
  const grouped: Record<CabinetType, number> = { base: 0, wall: 0, tall: 0, drawer_bank: 0 };
  for (const c of cabinets) {
    const t = normaliseCabinetType(c.type);
    grouped[t] += c.quantity ?? 1;
  }

  const details: LabourDetailLine[] = [];
  let fabTotal = 0;
  let installTotal = 0;
  let fabHours = 0;
  let installHours = 0;

  for (const [type, count] of Object.entries(grouped) as [CabinetType, number][]) {
    if (count === 0) continue;

    let fabCost: number;
    let installCost: number;

    if (method === "per_unit") {
      fabCost = count * (config.fabPerUnit[type] ?? config.fabPerUnit.base);
      installCost = count * (config.installPerUnit[type] ?? config.installPerUnit.base);
    } else {
      // hourly
      const fh = count * (config.fabHoursPerUnit[type] ?? config.fabHoursPerUnit.base);
      const ih = count * (config.installHoursPerUnit[type] ?? config.installHoursPerUnit.base);
      fabHours += fh;
      installHours += ih;
      fabCost = fh * config.fabHourlyRate;
      installCost = ih * config.installHourlyRate;
    }

    fabTotal += fabCost;
    installTotal += installCost;
    details.push({ cabinetType: type, count, fabCost, installCost });
  }

  fabTotal = Math.round(fabTotal * 100) / 100;
  installTotal = Math.round(installTotal * 100) / 100;
  fabHours = Math.round(fabHours * 100) / 100;
  installHours = Math.round(installHours * 100) / 100;

  const fabLineLabel =
    method === "hourly"
      ? `Fabrication labour (${fabHours}hrs × $${config.fabHourlyRate}/hr)`
      : `Fabrication labour (per unit)`;
  const installLineLabel =
    method === "hourly"
      ? `Installation labour (${installHours}hrs × $${config.installHourlyRate}/hr)`
      : `Installation labour (per unit)`;

  return { fabTotal, installTotal, fabHours, installHours, fabLineLabel, installLineLabel, details };
}

/** Nice display label for a method */
export const METHOD_LABELS: Record<LabourMethod, string> = {
  hourly: "Hourly rate × estimated hours",
  per_lm: "Per linear metre",
  per_unit: "Per cabinet unit",
};

export const CABINET_TYPE_LABELS: Record<CabinetType, string> = {
  base: "Base",
  wall: "Wall / Overhead",
  tall: "Tall / Pantry",
  drawer_bank: "Drawer Bank",
};
