export type PaintingSurfaceType =
  | "interior_walls"
  | "ceilings"
  | "trim_and_doors"
  | "exterior_walls"
  | "feature_wall";

export interface PaintingSurfaceStandard {
  labourHoursPerSqm: number;
  materialsAudPerSqm: number;
  prepHoursFixed?: number;
}

export const AU_PAINTING_SURFACE_STANDARDS: Record<PaintingSurfaceType, PaintingSurfaceStandard> = {
  interior_walls: {
    labourHoursPerSqm: 0.16,
    materialsAudPerSqm: 7.5,
  },
  ceilings: {
    labourHoursPerSqm: 0.12,
    materialsAudPerSqm: 6.2,
  },
  trim_and_doors: {
    labourHoursPerSqm: 0.24,
    materialsAudPerSqm: 9.8,
    prepHoursFixed: 1,
  },
  exterior_walls: {
    labourHoursPerSqm: 0.22,
    materialsAudPerSqm: 10.5,
    prepHoursFixed: 1.5,
  },
  feature_wall: {
    labourHoursPerSqm: 0.28,
    materialsAudPerSqm: 12.6,
  },
};

export const AU_PAINTING_DEFAULTS = {
  hourlyRateAud: 95,
  gstRate: 10,
  marginPercent: 22,
};
