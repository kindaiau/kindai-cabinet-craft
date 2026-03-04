export type AgentStatus = "active" | "standby" | "blocked";

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  mission: string;
  currentFocus: string;
  reportsTo?: string;
}

export const teamAgents: AgentNode[] = [
  {
    id: "jimmy",
    name: "Jimmy Fkn Barnes",
    role: "Org Lead Agent",
    status: "active",
    mission: "Coordinate all lanes, ship fast, keep quality and delivery tight.",
    currentFocus: "5-estimator rollout + dashboard/ops command center",
  },
  {
    id: "kindai-build",
    name: "Kindai Build Ops",
    role: "Product Delivery Sub-Agent",
    status: "active",
    mission: "Drive estimator app implementation, tests, and release readiness.",
    currentFocus: "Trade-specific UI tailoring and QA",
    reportsTo: "jimmy",
  },
  {
    id: "mariana-growth",
    name: "Mariana Growth Ops",
    role: "Funnel + Conversion Sub-Agent",
    status: "active",
    mission: "Increase lead-to-call conversion velocity and consistency.",
    currentFocus: "Offer/CTA alignment and funnel QA checklist",
    reportsTo: "jimmy",
  },
  {
    id: "openclaw-reliability",
    name: "OpenClaw Reliability Ops",
    role: "Automation + Cron Sub-Agent",
    status: "standby",
    mission: "Eliminate recurring automation failures and reduce downtime.",
    currentFocus: "Cron failure triage + recovery runbook",
    reportsTo: "jimmy",
  },
  {
    id: "go-to-market",
    name: "Go-To-Market Ops",
    role: "Monetisation + Launch Sub-Agent",
    status: "standby",
    mission: "Translate shipped features into conversion and revenue outcomes.",
    currentFocus: "Week-1 launch metrics and pricing test design",
    reportsTo: "jimmy",
  },
];
