import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculatePlumbingEstimate } from "@/trades/plumbing/estimate-engine";
import { calculateElectricalEstimate } from "@/trades/electrical/estimate-engine";
import { calculatePaintingEstimate } from "@/trades/painting/estimate-engine";
import { calculateFlooringEstimate } from "@/trades/flooring/estimate-engine";
import { calculateHvacEstimate } from "@/trades/hvac/estimate-engine";

const currency = (value: number) => `$${value.toFixed(2)}`;

export default function TradeWorkbench() {
  const [toilets, setToilets] = useState(2);
  const [lightingPoints, setLightingPoints] = useState(8);
  const [paintArea, setPaintArea] = useState(120);
  const [floorArea, setFloorArea] = useState(80);
  const [splitSystems, setSplitSystems] = useState(2);

  const plumbing = useMemo(
    () =>
      calculatePlumbingEstimate({
        lines: [{ fixture: "toilet", quantity: Math.max(0, toilets) }],
      }),
    [toilets]
  );

  const electrical = useMemo(
    () =>
      calculateElectricalEstimate({
        lines: [{ workType: "lighting_point", quantity: Math.max(0, lightingPoints) }],
      }),
    [lightingPoints]
  );

  const painting = useMemo(
    () =>
      calculatePaintingEstimate({
        lines: [{ surfaceType: "interior_walls", areaSqm: Math.max(0, paintArea) }],
      }),
    [paintArea]
  );

  const flooring = useMemo(
    () =>
      calculateFlooringEstimate({
        lines: [{ system: "hybrid_plank", areaM2: Math.max(0, floorArea) }],
      }),
    [floorArea]
  );

  const hvac = useMemo(
    () =>
      calculateHvacEstimate({
        lines: [{ system: "split_5kw", quantity: Math.max(0, splitSystems) }],
      }),
    [splitSystems]
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="font-display text-3xl font-bold">Trade Workbench (AU)</h1>
      <p className="mt-1 text-muted-foreground">Live estimator previews for the 5-app rollout.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <EstimatorCard
          title="Plumbing"
          inputLabel="Toilets"
          inputValue={toilets}
          onInputChange={setToilets}
          total={plumbing.total}
          preGst={plumbing.preGstTotal}
        />
        <EstimatorCard
          title="Electrical"
          inputLabel="Lighting Points"
          inputValue={lightingPoints}
          onInputChange={setLightingPoints}
          total={electrical.total}
          preGst={electrical.preGstTotal}
        />
        <EstimatorCard
          title="Painting"
          inputLabel="Wall Area (m²)"
          inputValue={paintArea}
          onInputChange={setPaintArea}
          total={painting.total}
          preGst={painting.preGstTotal}
        />
        <EstimatorCard
          title="Flooring"
          inputLabel="Floor Area (m²)"
          inputValue={floorArea}
          onInputChange={setFloorArea}
          total={flooring.total}
          preGst={flooring.preGstTotal}
        />
        <EstimatorCard
          title="HVAC"
          inputLabel="5kW Split Systems"
          inputValue={splitSystems}
          onInputChange={setSplitSystems}
          total={hvac.total}
          preGst={hvac.preGstTotal}
        />
      </div>
    </div>
  );
}

function EstimatorCard({
  title,
  inputLabel,
  inputValue,
  onInputChange,
  preGst,
  total,
}: {
  title: string;
  inputLabel: string;
  inputValue: number;
  onInputChange: (value: number) => void;
  preGst: number;
  total: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">{inputLabel}</Label>
          <Input
            type="number"
            min={0}
            value={inputValue}
            onChange={(e) => onInputChange(Number(e.target.value))}
          />
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between text-muted-foreground">
            <span>Pre-GST</span>
            <span>{currency(preGst)}</span>
          </div>
          <div className="flex justify-between font-semibold text-kindai-pink">
            <span>Total (inc GST)</span>
            <span>{currency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
