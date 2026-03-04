import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { missionKpis, missionQueue } from "@/lib/mission-control-data";

const statusClass: Record<string, string> = {
  on_track: "bg-kindai-green/10 text-kindai-green",
  at_risk: "bg-kindai-orange/10 text-kindai-orange",
  behind: "bg-destructive/10 text-destructive",
};

const priorityClass: Record<string, string> = {
  P0: "bg-destructive/10 text-destructive",
  P1: "bg-kindai-orange/10 text-kindai-orange",
  P2: "bg-kindai-blue/10 text-kindai-blue",
};

export default function MissionControl() {
  return (
    <div className="p-6 md:p-8 max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Mission Control</h1>
        <p className="mt-1 text-muted-foreground">Central command layer to scale Kindai + Mariana with 80% automation target.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {missionKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <Badge variant="secondary" className={statusClass[kpi.status]}>{kpi.status.replace("_", " ")}</Badge>
              </div>
              <p className="font-display text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">Target: {kpi.target}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Execution Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {missionQueue.map((item) => (
              <div key={`${item.lane}-${item.task}`} className="rounded-md border border-border px-3 py-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{item.task}</p>
                  <p className="text-xs text-muted-foreground">{item.lane}</p>
                </div>
                <Badge variant="secondary" className={priorityClass[item.priority]}>{item.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Control Panels</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            <QuickLink to="/org-dashboard" label="Org Dashboard" desc="Project health + calendar + goals" />
            <QuickLink to="/team" label="Team" desc="Org chart + sub-agent pods" />
            <QuickLink to="/documents" label="Documents" desc="Searchable docs registry" />
            <QuickLink to="/trade-workbench" label="Trade Workbench" desc="Estimator previews" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickLink({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <Link to={to} className="rounded-md border border-border p-3 hover:border-primary/40 transition-colors">
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </Link>
  );
}
