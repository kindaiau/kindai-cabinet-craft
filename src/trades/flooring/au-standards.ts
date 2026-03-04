export type FlooringSystemType =
  | "laminate"
  | "engineered_timber"
  | "hybrid_plank"
  | "vinyl_plank"
  | "carpet"
  | "tile";

export interface FlooringSystemStandard {
  labourHoursPerM2: number;
  materialsAudPerM2: number;
}

export const AU_FLOORING_SYSTEM_STANDARDS: Record<FlooringSystemType, FlooringSystemStandard> = {
  laminate: { labourHoursPerM2: 0.55, materialsAudPerM2: 52 },
  engineered_timber: { labourHoursPerM2: 0.75, materialsAudPerM2: 98 },
  hybrid_plank: { labourHoursPerM2: 0.6, materialsAudPerM2: 64 },
  vinyl_plank: { labourHoursPerM2: 0.5, materialsAudPerM2: 48 },
  carpet: { labourHoursPerM2: 0.45, materialsAudPerM2: 44 },
  tile: { labourHoursPerM2: 0.95, materialsAudPerM2: 82 },
};

export const AU_FLOORING_DEFAULTS = {
  hourlyRateAud: 115,
  gstRate: 10,
  marginPercent: 20,
};
