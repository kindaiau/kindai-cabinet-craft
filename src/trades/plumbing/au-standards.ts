export type PlumbingFixtureType =
  | "toilet"
  | "vanity"
  | "shower"
  | "bath"
  | "kitchen_sink"
  | "laundry_tub"
  | "hot_water_unit";

export interface PlumbingFixtureStandard {
  labourHours: number;
  calloutMaterialsAud: number;
}

export const AU_PLUMBING_FIXTURE_STANDARDS: Record<PlumbingFixtureType, PlumbingFixtureStandard> = {
  toilet: { labourHours: 2.5, calloutMaterialsAud: 120 },
  vanity: { labourHours: 3, calloutMaterialsAud: 180 },
  shower: { labourHours: 5, calloutMaterialsAud: 350 },
  bath: { labourHours: 6, calloutMaterialsAud: 420 },
  kitchen_sink: { labourHours: 3.5, calloutMaterialsAud: 220 },
  laundry_tub: { labourHours: 2.5, calloutMaterialsAud: 140 },
  hot_water_unit: { labourHours: 6, calloutMaterialsAud: 650 },
};

export const AU_PLUMBING_DEFAULTS = {
  hourlyRateAud: 145,
  gstRate: 10,
  marginPercent: 18,
};
