import {
  AU_PLUMBING_DEFAULTS,
  AU_PLUMBING_FIXTURE_STANDARDS,
  type PlumbingFixtureType,
} from "./au-standards";

export interface PlumbingJobLine {
  fixture: PlumbingFixtureType;
  quantity: number;
}

export interface PlumbingEstimateInput {
  lines: PlumbingJobLine[];
  hourlyRateAud?: number;
  marginPercent?: number;
  gstRate?: number;
}

export interface PlumbingEstimate {
  labourHours: number;
  labourCost: number;
  materialsCost: number;
  marginAmount: number;
  preGstTotal: number;
  gst: number;
  total: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export function calculatePlumbingEstimate(input: PlumbingEstimateInput): PlumbingEstimate {
  const hourlyRate = input.hourlyRateAud ?? AU_PLUMBING_DEFAULTS.hourlyRateAud;
  const marginPercent = input.marginPercent ?? AU_PLUMBING_DEFAULTS.marginPercent;
  const gstRate = input.gstRate ?? AU_PLUMBING_DEFAULTS.gstRate;

  let labourHours = 0;
  let materialsCost = 0;

  for (const line of input.lines) {
    const standard = AU_PLUMBING_FIXTURE_STANDARDS[line.fixture];
    const qty = Math.max(0, line.quantity);
    labourHours += standard.labourHours * qty;
    materialsCost += standard.calloutMaterialsAud * qty;
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
