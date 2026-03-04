export type DocumentStatus = "written" | "planned";

export interface DocumentEntry {
  title: string;
  path: string;
  area: "Mariana" | "Kindai" | "OpenClaw" | "GetGas" | "General";
  status: DocumentStatus;
  notes?: string;
}

export const documentRegistry: DocumentEntry[] = [
  { title: "AGENTS", path: "AGENTS.md", area: "General", status: "written" },
  { title: "SOUL", path: "SOUL.md", area: "General", status: "written" },
  { title: "USER", path: "USER.md", area: "General", status: "written" },
  { title: "MEMORY", path: "MEMORY.md", area: "General", status: "written" },
  { title: "TOOLS", path: "TOOLS.md", area: "General", status: "written" },
  { title: "Identity", path: "IDENTITY.md", area: "General", status: "written" },
  { title: "Kindai QA Playbook", path: "KINDAI_QA_PLAYBOOK.md", area: "Kindai", status: "written" },
  { title: "Scaling Plan 2026-02", path: "SCALING-PLAN-2026-02.md", area: "Kindai", status: "written" },
  { title: "Mariana Commissions Funnel Spec", path: "Mariana_Commissions_Funnel_Spec.md", area: "Mariana", status: "written" },
  { title: "Org Dashboard Data Registry", path: "kindai-cabinet-craft/src/lib/org-dashboard-data.ts", area: "OpenClaw", status: "written" },
  { title: "Trade Apps Registry", path: "kindai-cabinet-craft/src/lib/trade-apps.ts", area: "Kindai", status: "written" },
  { title: "Plumbing Module Notes", path: "kindai-cabinet-craft/src/trades/plumbing/README.md", area: "Kindai", status: "written" },
  { title: "Electrical Module Notes", path: "kindai-cabinet-craft/src/trades/electrical/README.md", area: "Kindai", status: "written" },
  { title: "Painting Module Notes", path: "kindai-cabinet-craft/src/trades/painting/README.md", area: "Kindai", status: "written" },
  { title: "Flooring Module Notes", path: "kindai-cabinet-craft/src/trades/flooring/README.md", area: "Kindai", status: "written" },
  { title: "HVAC Module Notes", path: "kindai-cabinet-craft/src/trades/hvac/README.md", area: "Kindai", status: "written" },

  { title: "Mariana Daily KPI SOP", path: "docs/mariana-daily-kpi-sop.md", area: "Mariana", status: "planned", notes: "Lead volume, contact rate, booked calls, SLA" },
  { title: "Kindai Launch Metrics Spec", path: "docs/kindai-launch-metrics-spec.md", area: "Kindai", status: "planned", notes: "Activation, completion, paid intent" },
  { title: "OpenClaw Cron Recovery Runbook", path: "docs/openclaw-cron-recovery-runbook.md", area: "OpenClaw", status: "planned", notes: "Failure triage and retry protocol" },
  { title: "GetGas Automation Recovery Plan", path: "docs/getgas-automation-recovery.md", area: "GetGas", status: "planned", notes: "Single-path closure checklist" },
];
