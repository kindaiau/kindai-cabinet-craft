import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { goalsTree, upcomingMilestones, workLanes, type WorkStatus } from "@/lib/org-dashboard-data";

const statusStyles: Record<WorkStatus, string> = {
  on_track: "bg-kindai-green/10 text-kindai-green",
  at_risk: "bg-kindai-orange/10 text-kindai-orange",
  blocked: "bg-destructive/10 text-destructive",
  done: "bg-kindai-aqua/10 text-kindai-aqua",
};

const laneStyles: Record<string, string> = {
  Mariana: "bg-kindai-pink/10 text-kindai-pink",
  Kindai: "bg-kindai-blue/10 text-kindai-blue",
  OpenClaw: "bg-kindai-aqua/10 text-kindai-aqua",
  GetGas: "bg-kindai-orange/10 text-kindai-orange",
};

function toDateLabel(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function OrgDashboard() {
  return (
    <div className="p-6 md:p-8 max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Operations Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Colour-coded execution tracker for Mariana, Kindai, OpenClaw, and GetGas.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Current Workstreams</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {workLanes.map((lane) => (
            <div key={lane.id} className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{lane.title}</p>
                  <p className="text-xs text-muted-foreground">Owner: {lane.owner}</p>
                </div>
                <div className="flex gap-1.5">
                  <Badge variant="secondary" className={laneStyles[lane.project]}>{lane.project}</Badge>
                  <Badge variant="secondary" className={statusStyles[lane.status]}>{lane.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.max(0, Math.min(100, lane.percent))}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{lane.percent}% complete</p>
              </div>
              <p className="text-sm text-muted-foreground">Next: {lane.nextStep}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Calendar (Upcoming Milestones)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingMilestones.map((m) => (
              <div key={`${m.date}-${m.title}`} className="rounded-md border border-border px-3 py-2 text-sm flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{toDateLabel(m.date)}</p>
                </div>
                <Badge variant="secondary" className={laneStyles[m.lane]}>{m.lane}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Scale & Monetise Diagram</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goalsTree.map((branch) => (
              <div key={branch.pillar} className="rounded-lg border border-border p-3">
                <p className="font-semibold">{branch.pillar}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                  {branch.goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
