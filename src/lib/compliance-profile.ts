export interface ComplianceProfile {
  appName: string;
  tradeCode: string;
  tradeLabel: string;
  standards: string[];
}

export const ACTIVE_COMPLIANCE_PROFILE: ComplianceProfile = {
  appName: "Kindai Cabinet Craft",
  tradeCode: "cabinetry",
  tradeLabel: "Cabinetry",
  standards: ["AS 4386 (Domestic kitchen assemblies)"]
};
