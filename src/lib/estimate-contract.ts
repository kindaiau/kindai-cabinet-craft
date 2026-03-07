export type ProjectType = "domestic" | "commercial" | "industrial";
export type EstimateLineSource = "extracted" | "assumed";
export type ReviewStatus = "draft" | "review_required" | "order_ready";

export interface ProjectInput {
  projectType: ProjectType;
  location: string;
  scope: string;
  urgency: "standard" | "priority" | "urgent";
  marginMode: "fixed" | "target";
  currency: "AUD";
}

export interface EstimateLineItemContract {
  trade: string;
  itemCode: string;
  description: string;
  qty: number;
  unit: string;
  unitRate: number;
  laborHours: number;
  wastePct: number;
  confidence: number;
  confidenceReasons: string[];
  assumptions: string[];
  source: EstimateLineSource;
}

export interface EstimateSummaryContract {
  subtotalMaterials: number;
  subtotalLabor: number;
  overheadPct: number;
  marginPct: number;
  gstPct: number;
  total: number;
}

export interface EstimateAuditMeta {
  generatedAt: string;
  schemaVersion: string;
  rulesVersion: string;
  generatedBy: string;
  gateStatus: ReviewStatus;
  gateReasons: string[];
}

export interface EstimateOutputContract {
  project: ProjectInput;
  lineItems: EstimateLineItemContract[];
  summary: EstimateSummaryContract;
  generatedAt: string;
  schemaVersion: string;
  reviewStatus: ReviewStatus;
  gateReasons: string[];
  assumptions: string[];
  aggregateConfidence: number;
  auditMeta: EstimateAuditMeta;
}

export interface ExportGateResult {
  allowed: boolean;
  reasons: string[];
}

export const ESTIMATE_SCHEMA_VERSION = "kindai-estimate-v1";
export const ESTIMATE_RULES_VERSION = "rules-au-v1";

export function canExportEstimate(contract: EstimateOutputContract): ExportGateResult {
  if (contract.reviewStatus !== "order_ready") {
    return {
      allowed: false,
      reasons: [
        ...contract.gateReasons,
        "Quote is in Draft / Review Required state and is not order-ready.",
      ],
    };
  }

  if (contract.aggregateConfidence < 80) {
    return {
      allowed: false,
      reasons: [
        "Aggregate confidence is below 80%. Complete missing data and reduce assumptions.",
      ],
    };
  }

  return { allowed: true, reasons: [] };
}
