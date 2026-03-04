export type ElectricalWorkType =
  | "lighting_point"
  | "power_point"
  | "switchboard_upgrade"
  | "smoke_alarm"
  | "ceiling_fan"
  | "exhaust_fan"
  | "data_point";

export interface ElectricalWorkStandard {
  labourHoursPerUnit: number;
  materialsAudPerUnit: number;
  minimumChargeUnits?: number;
}

export const AU_ELECTRICAL_WORK_STANDARDS: Record<ElectricalWorkType, ElectricalWorkStandard> = {
  lighting_point: {
    labourHoursPerUnit: 1.25,
    materialsAudPerUnit: 95,
  },
  power_point: {
    labourHoursPerUnit: 1,
    materialsAudPerUnit: 85,
  },
  switchboard_upgrade: {
    labourHoursPerUnit: 8,
    materialsAudPerUnit: 1350,
    minimumChargeUnits: 1,
  },
  smoke_alarm: {
    labourHoursPerUnit: 0.75,
    materialsAudPerUnit: 65,
  },
  ceiling_fan: {
    labourHoursPerUnit: 1.75,
    materialsAudPerUnit: 175,
  },
  exhaust_fan: {
    labourHoursPerUnit: 1.5,
    materialsAudPerUnit: 160,
  },
  data_point: {
    labourHoursPerUnit: 1.25,
    materialsAudPerUnit: 110,
  },
};

export const AU_ELECTRICAL_DEFAULTS = {
  hourlyRateAud: 150,
  gstRate: 10,
  marginPercent: 20,
};
