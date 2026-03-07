import type { QuoteLineItem } from "@/lib/generate-quote-pdf";
import type { EstimateLineItemContract, ReviewStatus } from "@/lib/estimate-contract";

interface ConfidenceInput {
  lines: QuoteLineItem[];
  businessAbn: string;
  clientEmail: string;
  projectName: string;
}

export interface ConfidenceResult {
  normalizedLines: EstimateLineItemContract[];
  assumptions: string[];
  blockers: string[];
  aggregateConfidence: number;
  reviewStatus: ReviewStatus;
}

function clamp(number: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, number));
}

export function evaluateConfidenceAndAssumptions(input: ConfidenceInput): ConfidenceResult {
  const assumptions: string[] = [];
  const blockers: string[] = [];

  if (!input.clientEmail) {
    assumptions.push("Client email missing. Confirm before issuing final quote.");
  }

  if (!input.businessAbn) {
    assumptions.push("Business ABN missing. Add ABN before issuing compliant quote.");
  }

  if (!input.projectName.trim()) {
    blockers.push("Project name is required before final export.");
  }

  const normalizedLines: EstimateLineItemContract[] = input.lines.map((line, index) => {
    const reasons: string[] = [];
    const lineAssumptions: string[] = [];
    let confidence = 100;

    if (!line.description.trim()) {
      confidence -= 45;
      reasons.push("Missing line item description.");
      blockers.push(`Line ${index + 1}: description is required.`);
    }

    if (line.unitPrice <= 0) {
      confidence -= 35;
      reasons.push("Unit price is zero or missing.");
      blockers.push(`Line ${index + 1}: unit price must be greater than 0.`);
    }

    if (line.quantity <= 0) {
      confidence -= 30;
      reasons.push("Quantity must be greater than 0.");
      blockers.push(`Line ${index + 1}: quantity must be greater than 0.`);
    }

    const hasCabinetKeyword = /cabinet|base|wall|tall|pantry|drawer|overhead/i.test(line.description);
    if (hasCabinetKeyword) {
      lineAssumptions.push("Cabinet width defaults to 600mm if exact width is not provided.");
      confidence -= 5;
    }

    const source: "assumed" | "extracted" = reasons.length > 0 || lineAssumptions.length > 0 ? "assumed" : "extracted";

    return {
      trade: "cabinetry",
      itemCode: `LI-${index + 1}`,
      description: line.description,
      qty: line.quantity,
      unit: line.unit,
      unitRate: line.unitPrice,
      laborHours: 0,
      wastePct: hasCabinetKeyword ? 10 : 0,
      confidence: clamp(confidence),
      confidenceReasons: reasons,
      assumptions: lineAssumptions,
      source,
    };
  });

  const lineConfidence = normalizedLines.length > 0
    ? normalizedLines.reduce((sum, line) => sum + line.confidence, 0) / normalizedLines.length
    : 0;

  const aggregateConfidence = clamp(Math.round(lineConfidence - assumptions.length * 3));
  const reviewStatus: ReviewStatus = blockers.length > 0 || aggregateConfidence < 80 ? "review_required" : "order_ready";

  return {
    normalizedLines,
    assumptions,
    blockers,
    aggregateConfidence,
    reviewStatus,
  };
}
