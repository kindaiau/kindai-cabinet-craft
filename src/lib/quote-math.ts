export interface QuoteTotalsInput {
  materialsSubtotal: number;
  labourFab: number;
  labourInstall: number;
  gstRate: number;
}

export interface QuoteTotals {
  materialsSubtotal: number;
  labourFab: number;
  labourInstall: number;
  labourTotal: number;
  preGstTotal: number;
  gst: number;
  total: number;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

export function calculateQuoteTotals(input: QuoteTotalsInput): QuoteTotals {
  const materialsSubtotal = round2(Math.max(0, input.materialsSubtotal));
  const labourFab = round2(Math.max(0, input.labourFab));
  const labourInstall = round2(Math.max(0, input.labourInstall));
  const gstRate = Math.max(0, input.gstRate);

  const labourTotal = round2(labourFab + labourInstall);
  const preGstTotal = round2(materialsSubtotal + labourTotal);
  const gst = round2(preGstTotal * (gstRate / 100));
  const total = round2(preGstTotal + gst);

  return {
    materialsSubtotal,
    labourFab,
    labourInstall,
    labourTotal,
    preGstTotal,
    gst,
    total,
  };
}
