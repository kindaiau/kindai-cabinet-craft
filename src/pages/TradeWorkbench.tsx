import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TradeWorkbench() {
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Cabinet Workbench (AU)</h1>
      <p className="mt-1 text-muted-foreground">
        This app is scoped to cabinetry estimating and quoting workflows only.
      </p>

      <Card className="mt-6 max-w-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg">Scope guardrail</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Included: cabinetry quoting, labour configuration, compliance-gated export.</p>
          <p>Excluded from this app: plumbing, electrical, painting, flooring, HVAC workbenches.</p>
        </CardContent>
      </Card>
    </div>
  );
}
