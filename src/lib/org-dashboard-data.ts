export type WorkStatus = "on_track" | "at_risk" | "blocked" | "done";

export interface WorkLane {
  id: string;
  project: "Mariana" | "Kindai" | "OpenClaw" | "GetGas";
  title: string;
  owner: string;
  status: WorkStatus;
  percent: number;
  nextStep: string;
}

export interface Milestone {
  date: string; // YYYY-MM-DD
  title: string;
  lane: "Mariana" | "Kindai" | "OpenClaw" | "GetGas";
}

export const workLanes: WorkLane[] = [
  {
    id: "mariana-funnel",
    project: "Mariana",
    title: "Commission Funnel Reliability",
    owner: "Jimmy",
    status: "at_risk",
    percent: 65,
    nextStep: "Run one dummy lead end-to-end and patch breakpoints.",
  },
  {
    id: "mariana-offer",
    project: "Mariana",
    title: "Offer + CTA System",
    owner: "Jimmy",
    status: "on_track",
    percent: 70,
    nextStep: "Lock primary offer + backup CTA and propagate to ads/LP/email.",
  },
  {
    id: "kindai-5apps",
    project: "Kindai",
    title: "5 Estimator Apps Rollout",
    owner: "Jimmy",
    status: "on_track",
    percent: 75,
    nextStep: "Replace trade-specific copy and complete each app's workflow QA.",
  },
  {
    id: "kindai-monetisation",
    project: "Kindai",
    title: "Week-1 Monetisation Metrics",
    owner: "Jimmy",
    status: "at_risk",
    percent: 40,
    nextStep: "Instrument activation/completion/paid intent with clear targets.",
  },
  {
    id: "openclaw-ops",
    project: "OpenClaw",
    title: "Cron + Relay Reliability",
    owner: "Jimmy",
    status: "on_track",
    percent: 60,
    nextStep: "Close fetch-failed cron path and add daily reliability checks.",
  },
  {
    id: "getgas-automation",
    project: "GetGas",
    title: "Highest-Impact Automation Fix",
    owner: "Jimmy",
    status: "blocked",
    percent: 35,
    nextStep: "Choose one broken path and fix end-to-end with live verification.",
  },
];

export const upcomingMilestones: Milestone[] = [
  { date: "2026-03-05", title: "Mariana dummy lead full-path QA", lane: "Mariana" },
  { date: "2026-03-05", title: "Kindai estimator ship order freeze", lane: "Kindai" },
  { date: "2026-03-06", title: "Trade-specific UX pass (all estimator apps)", lane: "Kindai" },
  { date: "2026-03-06", title: "OpenClaw cron failure root-cause close", lane: "OpenClaw" },
  { date: "2026-03-07", title: "Mariana KPI dashboard live", lane: "Mariana" },
  { date: "2026-03-08", title: "Kindai week-1 metrics instrumentation", lane: "Kindai" },
];

export const goalsTree = [
  {
    pillar: "Mariana Monetisation",
    goals: [
      "Increase qualified commission leads",
      "Improve contact rate + booked brief calls",
      "Shorten response SLA with automation",
    ],
  },
  {
    pillar: "Kindai Product Revenue",
    goals: [
      "Ship 5 AU-ready estimator apps",
      "Track activation/completion/paid intent",
      "Run weekly pricing + offer tests",
    ],
  },
  {
    pillar: "Operational Reliability",
    goals: [
      "Stabilize OpenClaw automation",
      "Reduce relay/cron failures",
      "Maintain clean handoff visibility",
    ],
  },
];
