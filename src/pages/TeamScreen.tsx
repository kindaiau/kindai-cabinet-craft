import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teamAgents, type AgentStatus } from "@/lib/team-ops-data";

const statusClass: Record<AgentStatus, string> = {
  active: "bg-kindai-green/10 text-kindai-green",
  standby: "bg-kindai-blue/10 text-kindai-blue",
  blocked: "bg-destructive/10 text-destructive",
};

export default function TeamScreen() {
  const lead = teamAgents.find((a) => !a.reportsTo);
  const pods = teamAgents.filter((a) => a.reportsTo === lead?.id);

  return (
    <div className="p-6 md:p-8 max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Team & Org Chart</h1>
        <p className="mt-1 text-muted-foreground">Agent team structure for execution, delegation, and delivery velocity.</p>
      </div>

      {lead && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Org Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentCard agent={lead} isLead />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Sub-Agent Pods</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {pods.map((pod) => (
            <AgentCard key={pod.id} agent={pod} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">Org Chart (Simple)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border p-4 text-sm">
            <p className="font-semibold">{lead?.name} ({lead?.role})</p>
            <div className="mt-2 pl-4 border-l border-border space-y-1.5">
              {pods.map((pod) => (
                <p key={pod.id}>↳ {pod.name} — {pod.role}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AgentCard({
  agent,
  isLead = false,
}: {
  agent: (typeof teamAgents)[number];
  isLead?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium truncate">{agent.name}</p>
          <p className="text-xs text-muted-foreground truncate">{agent.role}{isLead ? " · Lead" : ""}</p>
        </div>
        <Badge variant="secondary" className={statusClass[agent.status]}>{agent.status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{agent.mission}</p>
      <p className="text-xs text-muted-foreground">Current focus: {agent.currentFocus}</p>
    </div>
  );
}
