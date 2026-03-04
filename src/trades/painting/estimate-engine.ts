import {
  AU_PAINTING_DEFAULTS,
  AU_PAINTING_SURFACE_STANDARDS,
  type PaintingSurfaceType,
} from "./au-standards";

export interface PaintingEstimateLineInput {
  surfaceType: PaintingSurfaceType;
  areaSqm: number;
}

export interface PaintingEstimateInput {
  lines: PaintingEstimateLineInput[];
  hourlyRateAud?: number;
  marginPercent?: number;
  gstRate?: number;
}

export interface PaintingEstimateLineResult {
  surfaceType: PaintingSurfaceType;
  areaSqm: number;
  prepHours: number;
  productionHours: number;
  labourHours: number;
  labourCost: number;
  materialsCost: number;
  directCost: number;
}

export interface PaintingEstimate {
  lines: PaintingEstimateLineResult[];
  labourHours: number;
  labourCost: number;
  materialsCost: number;
  directCost: number;
  marginAmount: number;
  preGstTotal: number;
  gst: number;
  total: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

const sanitizeArea = (areaSqm: number) => Math.max(0, areaSqm);

export function calculatePaintingEstimate(input: PaintingEstimateInput): PaintingEstimate {
  const hourlyRateAud = input.hourlyRateAud ?? AU_PAINTING_DEFAULTS.hourlyRateAud;
  const marginPercent = input.marginPercent ?? AU_PAINTING_DEFAULTS.marginPercent;
  const gstRate = input.gstRate ?? AU_PAINTING_DEFAULTS.gstRate;

  const lines: PaintingEstimateLineResult[] = input.lines.map((line) => {
    const standard = AU_PAINTING_SURFACE_STANDARDS[line.surfaceType];
    const areaSqm = sanitizeArea(line.areaSqm);

    const prepHours = round2(areaSqm > 0 ? standard.prepHoursFixed ?? 0 : 0);
    const productionHours = round2(areaSqm * standard.labourHoursPerSqm);
    const labourHours = round2(prepHours + productionHours);
    const labourCost = round2(labourHours * hourlyRateAud);
    const materialsCost = round2(areaSqm * standard.materialsAudPerSqm);
    const directCost = round2(labourCost + materialsCost);

    return {
      surfaceType: line.surfaceType,
      areaSqm,
      prepHours,
      productionHours,
      labourHours,
      labourCost,
      materialsCost,
      directCost,
    };
  });

  const labourHours = round2(lines.reduce((sum, line) => sum + line.labourHours, 0));
  const labourCost = round2(lines.reduce((sum, line) => sum + line.labourCost, 0));
  const materialsCost = round2(lines.reduce((sum, line) => sum + line.materialsCost, 0));
  const directCost = round2(lines.reduce((sum, line) => sum + line.directCost, 0));
  const marginAmount = round2(directCost * (marginPercent / 100));
  const preGstTotal = round2(directCost + marginAmount);
  const gst = round2(preGstTotal * (gstRate / 100));
  const total = round2(preGstTotal + gst);

  return {
    lines,
    labourHours,
    labourCost,
    materialsCost,
    directCost,
    marginAmount,
    preGstTotal,
    gst,
    total,
  };
}
