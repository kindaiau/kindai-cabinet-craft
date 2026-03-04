import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calculator, Upload, ChevronDown, ChevronUp, Settings2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { calculateTakeoff, DEFAULT_WASTE_FACTORS, AU_SHEET, type TakeoffResult, type Cabinet } from "@/lib/takeoff-engine";

interface PlanAnalysis {
  summary: string;
  room_type: string;
  cabinets: Cabinet[];
  total_linear_metres?: number;
  estimated_carcass_sheets?: number;
  notes?: string;
}

interface Plan {
  id: string;
  file_name: string;
  status: string;
  analysis: PlanAnalysis | null;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  Carcass: "bg-kindai-blue/10 text-kindai-blue",
  "Doors & Fronts": "bg-kindai-pink/10 text-kindai-pink",
  Shelves: "bg-kindai-green/10 text-kindai-green",
  "Edge Banding": "bg-kindai-aqua/10 text-kindai-aqua",
  Hardware: "bg-kindai-orange/10 text-kindai-orange",
};

export default function MaterialTakeoff() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [wasteOpen, setWasteOpen] = useState(false);
  const [wasteFactor, setWasteFactor] = useState({ ...DEFAULT_WASTE_FACTORS });

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans-analyzed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("status", "analyzed")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Plan[];
    },
  });

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const cabinets = useMemo(() => selectedPlan?.analysis?.cabinets ?? [], [selectedPlan]);

  const takeoff: TakeoffResult | null = useMemo(() => {
    if (cabinets.length === 0) return null;
    return calculateTakeoff(cabinets, wasteFactor);
  }, [cabinets, wasteFactor]);

  // No analyzed plans
  if (!isLoading && plans.length === 0) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="font-display text-3xl font-bold">Material Take-Off</h1>
        <p className="mt-1 text-muted-foreground">Review and calculate materials from your plans</p>
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-kindai-aqua/10 p-6">
            <Upload className="h-12 w-12 text-kindai-aqua" />
          </div>
          <h2 className="mt-6 font-display text-xl font-semibold">No analyzed plans yet</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Upload and analyze a plan first to generate your material take-off.
          </p>
          <Link to="/upload">
            <Button className="mt-6 gradient-kindai border-0 font-semibold">
              <Upload className="mr-2 h-4 w-4" /> Upload Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Material Take-Off</h1>
          <p className="mt-1 text-muted-foreground">
            AU standard sheets {AU_SHEET.width}×{AU_SHEET.height}mm · Waste factors applied
          </p>
        </div>
      </div>

      {/* Plan selector */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 max-w-md space-y-1.5">
          <Label>Select Analyzed Plan</Label>
          <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a plan…" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.file_name} — {p.analysis?.summary?.slice(0, 40) || "Analyzed"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Waste factor settings */}
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
                      type="number"
                      min={0}
                      max={50}
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

      {/* No plan selected */}
      {!selectedPlan && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-kindai-aqua/10 p-6">
            <Calculator className="h-12 w-12 text-kindai-aqua" />
          </div>
          <h2 className="mt-6 font-display text-xl font-semibold">Select a plan above</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Choose an analyzed plan to calculate the full material take-off.
          </p>
        </div>
      )}

      {/* Takeoff results */}
      {takeoff && (
        <>
          {/* Summary cards */}
          <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
            <SummaryCard label="Carcass Sheets" value={takeoff.summary.totalCarcassSheets} unit="sheets" color="kindai-blue" />
            <SummaryCard label="Door Sheets" value={takeoff.summary.totalDoorSheets} unit="sheets" color="kindai-pink" />
            <SummaryCard label="Edge Banding" value={takeoff.summary.totalEdgeBanding_m} unit="metres" color="kindai-aqua" />
            <SummaryCard label="Hinges" value={takeoff.summary.totalHinges} unit="pcs" color="kindai-orange" />
          </div>

          {/* Cabinets found */}
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

          {/* Line items table */}
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
        </>
      )}
    </div>
  );
}

const summaryColorClass: Record<string, string> = {
  "kindai-blue": "text-kindai-blue",
  "kindai-pink": "text-kindai-pink",
  "kindai-aqua": "text-kindai-aqua",
  "kindai-orange": "text-kindai-orange",
};

function SummaryCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`font-display text-2xl font-bold mt-1 ${summaryColorClass[color] ?? "text-foreground"}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{unit}</p>
      </CardContent>
    </Card>
  );
}
