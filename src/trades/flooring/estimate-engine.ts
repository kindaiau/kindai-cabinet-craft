import {
  AU_FLOORING_DEFAULTS,
  AU_FLOORING_SYSTEM_STANDARDS,
  type FlooringSystemType,
} from "./au-standards";

export interface FlooringJobLine {
  system: FlooringSystemType;
  areaM2: number;
}

export interface FlooringEstimateInput {
  lines: FlooringJobLine[];
  hourlyRateAud?: number;
  marginPercent?: number;
  gstRate?: number;
}

export interface FlooringEstimate {
  labourHours: number;
  labourCost: number;
  materialsCost: number;
  marginAmount: number;
  preGstTotal: number;
  gst: number;
  total: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export function calculateFlooringEstimate(input: FlooringEstimateInput): FlooringEstimate {
  const hourlyRate = input.hourlyRateAud ?? AU_FLOORING_DEFAULTS.hourlyRateAud;
  const marginPercent = input.marginPercent ?? AU_FLOORING_DEFAULTS.marginPercent;
  const gstRate = input.gstRate ?? AU_FLOORING_DEFAULTS.gstRate;

  let labourHours = 0;
  let materialsCost = 0;

  for (const line of input.lines) {
    const standard = AU_FLOORING_SYSTEM_STANDARDS[line.system];
    const area = Math.max(0, line.areaM2);
    labourHours += standard.labourHoursPerM2 * area;
    materialsCost += standard.materialsAudPerM2 * area;
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
