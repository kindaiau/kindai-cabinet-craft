export interface MissionKpi {
  label: string;
  value: string;
  target: string;
  status: "on_track" | "at_risk" | "behind";
}

export const missionKpis: MissionKpi[] = [
  { label: "Kindai ARR", value: "$0.12M", target: "$1.00M", status: "at_risk" },
  { label: "Mariana Revenue", value: "$0.05M", target: "$0.35M", status: "at_risk" },
  { label: "Automation Coverage", value: "58%", target: "80%", status: "on_track" },
  { label: "Estimator Apps Ready", value: "5/5", target: "5/5", status: "on_track" },
];

export const missionQueue: Array<{ lane: string; task: string; priority: "P0" | "P1" | "P2" }> = [
  { lane: "Mariana", task: "Run dummy lead end-to-end and patch failure points", priority: "P0" },
  { lane: "Kindai", task: "Complete trade-specific copy and UX for all estimator apps", priority: "P0" },
  { lane: "OpenClaw", task: "Auto-sync org dashboard from cron + git activity", priority: "P1" },
  { lane: "GetGas", task: "Fix one highest-impact automation path end-to-end", priority: "P1" },
];
