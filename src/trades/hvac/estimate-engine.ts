import {
  AU_HVAC_DEFAULTS,
  AU_HVAC_SYSTEM_STANDARDS,
  type HvacSystemType,
} from "./au-standards";

export interface HvacJobLine {
  system: HvacSystemType;
  quantity: number;
}

export interface HvacEstimateInput {
  lines: HvacJobLine[];
  hourlyRateAud?: number;
  marginPercent?: number;
  gstRate?: number;
}

export interface HvacEstimate {
  labourHours: number;
  labourCost: number;
  materialsCost: number;
  marginAmount: number;
  preGstTotal: number;
  gst: number;
  total: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export function calculateHvacEstimate(input: HvacEstimateInput): HvacEstimate {
  const hourlyRate = input.hourlyRateAud ?? AU_HVAC_DEFAULTS.hourlyRateAud;
  const marginPercent = input.marginPercent ?? AU_HVAC_DEFAULTS.marginPercent;
  const gstRate = input.gstRate ?? AU_HVAC_DEFAULTS.gstRate;

  let labourHours = 0;
  let materialsCost = 0;

  for (const line of input.lines) {
    const standard = AU_HVAC_SYSTEM_STANDARDS[line.system];
    const qty = Math.max(0, line.quantity);
    labourHours += standard.labourHours * qty;
    materialsCost += standard.materialsAud * qty;
  }

  const labourCost = round2(labourHours * hourlyRate);
  const directCost = round2(labourCost + materialsCost);
  const marginAmount = round2(directCost * (marginPercent / 100));
  const preGstTotal = round2(directCost + marginAmount);
  const gst = round2(preGstTotal * (gstRate / 100));
  const total = round2(preGstTotal + gst);

  return {
    labourHours: round2(labourHours),
    labourCost,
    materialsCost: round2(materialsCost),
    marginAmount,
    preGstTotal,
    gst,
    total,
  };
}
