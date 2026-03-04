import {
  AU_ELECTRICAL_DEFAULTS,
  AU_ELECTRICAL_WORK_STANDARDS,
  type ElectricalWorkType,
} from "./au-standards";

export interface ElectricalEstimateLineInput {
  workType: ElectricalWorkType;
  quantity: number;
}

export interface ElectricalEstimateInput {
  lines: ElectricalEstimateLineInput[];
  hourlyRateAud?: number;
  marginPercent?: number;
  gstRate?: number;
}

export interface ElectricalEstimateLineResult {
  workType: ElectricalWorkType;
  quantity: number;
  billableUnits: number;
  labourHours: number;
  labourCost: number;
  materialsCost: number;
  directCost: number;
}

export interface ElectricalEstimate {
  lines: ElectricalEstimateLineResult[];
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

const sanitizeQuantity = (quantity: number) => Math.max(0, quantity);

export function calculateElectricalEstimate(input: ElectricalEstimateInput): ElectricalEstimate {
  const hourlyRateAud = input.hourlyRateAud ?? AU_ELECTRICAL_DEFAULTS.hourlyRateAud;
  const marginPercent = input.marginPercent ?? AU_ELECTRICAL_DEFAULTS.marginPercent;
  const gstRate = input.gstRate ?? AU_ELECTRICAL_DEFAULTS.gstRate;

  const lines: ElectricalEstimateLineResult[] = input.lines.map((line) => {
    const standard = AU_ELECTRICAL_WORK_STANDARDS[line.workType];
    const quantity = sanitizeQuantity(line.quantity);
    const billableUnits = Math.max(quantity, standard.minimumChargeUnits ?? 0);

    const labourHours = round2(billableUnits * standard.labourHoursPerUnit);
    const labourCost = round2(labourHours * hourlyRateAud);
    const materialsCost = round2(billableUnits * standard.materialsAudPerUnit);
    const directCost = round2(labourCost + materialsCost);

    return {
      workType: line.workType,
      quantity,
      billableUnits,
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
