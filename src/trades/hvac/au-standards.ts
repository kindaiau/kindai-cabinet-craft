export type HvacSystemType =
  | "split_2_5kw"
  | "split_5kw"
  | "split_7kw"
  | "ducted_small"
  | "ducted_medium"
  | "ventilation_fan";

export interface HvacSystemStandard {
  labourHours: number;
  materialsAud: number;
}

export const AU_HVAC_SYSTEM_STANDARDS: Record<HvacSystemType, HvacSystemStandard> = {
  split_2_5kw: { labourHours: 6, materialsAud: 980 },
  split_5kw: { labourHours: 7.5, materialsAud: 1320 },
  split_7kw: { labourHours: 9, materialsAud: 1680 },
  ducted_small: { labourHours: 16, materialsAud: 5200 },
  ducted_medium: { labourHours: 22, materialsAud: 7400 },
  ventilation_fan: { labourHours: 2.5, materialsAud: 280 },
};

export const AU_HVAC_DEFAULTS = {
  hourlyRateAud: 160,
  gstRate: 10,
  marginPercent: 22,
};
