import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRADE_APPS } from "@/lib/trade-apps";

const statusClass: Record<string, string> = {
  live: "bg-kindai-green/10 text-kindai-green",
  in_progress: "bg-kindai-orange/10 text-kindai-orange",
  scoping: "bg-kindai-blue/10 text-kindai-blue",
};

export default function TradeApps() {
  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="font-display text-3xl font-bold">Estimator Suite</h1>
      <p className="mt-1 text-muted-foreground">Australian trade-tailored estimator apps shipping from one hardened base.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {TRADE_APPS.map((app) => (
          <Card key={app.slug}>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg flex items-center justify-between">
                <span>{app.name}</span>
                <Badge variant="secondary" className={statusClass[app.status]}>
                  {app.status.replace("_", " ")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium text-foreground">Trade:</span> {app.trade}</p>
              <p><span className="font-medium text-foreground">Market:</span> {app.region}</p>
              <p>{app.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
