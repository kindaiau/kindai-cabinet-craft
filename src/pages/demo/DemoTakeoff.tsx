import { useMemo, useState } from "react";
import { Calculator, Package, Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DEMO_PLAN, DEMO_CABINETS } from "@/contexts/DemoContext";
import { calculateTakeoff, DEFAULT_WASTE_FACTORS, AU_SHEET, type TakeoffResult, type Cabinet } from "@/lib/takeoff-engine";
import { Link } from "react-router-dom";

const categoryColors: Record<string, string> = {
  Carcass: "bg-kindai-blue/10 text-kindai-blue",
  "Doors & Fronts": "bg-kindai-pink/10 text-kindai-pink",
  Shelves: "bg-kindai-green/10 text-kindai-green",
  "Edge Banding": "bg-kindai-aqua/10 text-kindai-aqua",
  Hardware: "bg-kindai-orange/10 text-kindai-orange",
};

export default function DemoTakeoff() {
  const [wasteOpen, setWasteOpen] = useState(false);
  const [wasteFactor, setWasteFactor] = useState({ ...DEFAULT_WASTE_FACTORS });

  const cabinets = DEMO_CABINETS as Cabinet[];
  const takeoff: TakeoffResult = useMemo(() => calculateTakeoff(cabinets, wasteFactor), [cabinets, wasteFactor]);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Material Take-Off</h1>
          <p className="mt-1 text-muted-foreground">
            AU standard sheets {AU_SHEET.width}×{AU_SHEET.height}mm · Waste factors applied
          </p>
          <p className="mt-1 text-xs text-muted-foreground italic">
            Source: {DEMO_PLAN.file_name} — {DEMO_PLAN.analysis.summary}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <Collapsible open={wasteOpen} onOpenChange={setWasteOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-1" />
              Waste Factors
              {wasteOpen ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute z-10 mt-2 rounded-lg border border-border bg-card p-4 shadow-lg">
            <div className="grid grid-cols-2 gap-3 min-w-[280px]">
              {Object.entries(wasteFactor).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number" min={0} max={50}
                      value={val}
                      onChange={(e) => setWasteFactor((f) => ({ ...f, [key]: Number(e.target.value) }))}
                      className="h-8 w-16 text-sm"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
        <SummaryCard label="Carcass Sheets" value={takeoff.summary.totalCarcassSheets} unit="sheets" color="kindai-blue" />
        <SummaryCard label="Door Sheets" value={takeoff.summary.totalDoorSheets} unit="sheets" color="kindai-pink" />
        <SummaryCard label="Edge Banding" value={takeoff.summary.totalEdgeBanding_m} unit="metres" color="kindai-aqua" />
        <SummaryCard label="Hinges" value={takeoff.summary.totalHinges} unit="pcs" color="kindai-orange" />
      </div>

      {/* Cabinets */}
      <div className="mt-6">
        <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {cabinets.length} Cabinets from Plan
        </h3>
        <div className="flex flex-wrap gap-2">
          {cabinets.map((c, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {c.label} ({c.width_mm}×{c.height_mm}mm)
            </Badge>
          ))}
        </div>
      </div>

      {/* Material schedule */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-kindai-green" />
            Material Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Raw Qty</TableHead>
                <TableHead className="text-right">Waste %</TableHead>
                <TableHead className="text-right">Adjusted Qty</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {takeoff.lineItems.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Badge variant="secondary" className={categoryColors[item.category] || "bg-muted"}>
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right">{item.rawQty}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.wastePercent}%</TableCell>
                  <TableCell className="text-right font-semibold">{item.adjustedQty}</TableCell>
                  <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link to="/demo/quotes">
          <Button className="gradient-kindai border-0 font-semibold">
            Build a Quote →
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`font-display text-2xl font-bold text-${color} mt-1`}>{value}</p>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </CardContent>
    </Card>
  );
}
