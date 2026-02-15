import { useState } from "react";
import { Wrench, HardHat, Clock, Ruler, Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  type LabourConfig,
  type LabourBreakdown,
  type CabinetInput,
  type LabourMethod,
  type CabinetType,
  METHOD_LABELS,
  CABINET_TYPE_LABELS,
  DEFAULT_LABOUR_CONFIG,
  calculateLabour,
} from "@/lib/labour-engine";

interface LabourConfigPanelProps {
  config: LabourConfig;
  onConfigChange: (config: LabourConfig) => void;
  /** Optional: if cabinets are provided, show a live cost preview */
  cabinets?: CabinetInput[];
}

export default function LabourConfigPanel({ config, onConfigChange, cabinets = [] }: LabourConfigPanelProps) {
  const update = (partial: Partial<LabourConfig>) => onConfigChange({ ...config, ...partial });

  const updatePerUnit = (
    field: "fabPerUnit" | "installPerUnit" | "fabHoursPerUnit" | "installHoursPerUnit",
    type: CabinetType,
    value: number
  ) => {
    onConfigChange({ ...config, [field]: { ...config[field], [type]: value } });
  };

  const breakdown: LabourBreakdown | null = cabinets.length > 0 ? calculateLabour(cabinets, config) : null;
  const cabinetTypes: CabinetType[] = ["base", "wall", "tall", "drawer_bank"];

  return (
    <Card className="relative overflow-hidden">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-kindai-violet/10 blur-3xl" />

      <CardHeader className="pb-4">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Wrench className="h-4 w-4 text-kindai-violet" />
          Labour Rates
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Method selector */}
        <Tabs
          value={config.method}
          onValueChange={(v) => update({ method: v as LabourMethod })}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="hourly" className="text-xs gap-1.5 py-2">
              <Clock className="h-3.5 w-3.5" /> Hourly
            </TabsTrigger>
            <TabsTrigger value="per_lm" className="text-xs gap-1.5 py-2">
              <Ruler className="h-3.5 w-3.5" /> Per LM
            </TabsTrigger>
            <TabsTrigger value="per_unit" className="text-xs gap-1.5 py-2">
              <Box className="h-3.5 w-3.5" /> Per Unit
            </TabsTrigger>
          </TabsList>

          {/* Hourly */}
          <TabsContent value="hourly" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Wrench className="h-3 w-3" /> Fabrication
                </p>
                <div className="space-y-1.5">
                  <Label className="text-xs">Hourly Rate ($/hr)</Label>
                  <Input
                    type="number" min={0} step={1}
                    value={config.fabHourlyRate}
                    onChange={(e) => update({ fabHourlyRate: Number(e.target.value) })}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mt-2">Hours per cabinet type</p>
                {cabinetTypes.map((t) => (
                  <div key={t} className="flex items-center justify-between gap-2">
                    <Label className="text-xs flex-1">{CABINET_TYPE_LABELS[t]}</Label>
                    <Input
                      type="number" min={0} step={0.25}
                      value={config.fabHoursPerUnit[t]}
                      onChange={(e) => updatePerUnit("fabHoursPerUnit", t, Number(e.target.value))}
                      className="w-20 text-center text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <HardHat className="h-3 w-3" /> Installation
                </p>
                <div className="space-y-1.5">
                  <Label className="text-xs">Hourly Rate ($/hr)</Label>
                  <Input
                    type="number" min={0} step={1}
                    value={config.installHourlyRate}
                    onChange={(e) => update({ installHourlyRate: Number(e.target.value) })}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mt-2">Hours per cabinet type</p>
                {cabinetTypes.map((t) => (
                  <div key={t} className="flex items-center justify-between gap-2">
                    <Label className="text-xs flex-1">{CABINET_TYPE_LABELS[t]}</Label>
                    <Input
                      type="number" min={0} step={0.25}
                      value={config.installHoursPerUnit[t]}
                      onChange={(e) => updatePerUnit("installHoursPerUnit", t, Number(e.target.value))}
                      className="w-20 text-center text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Per LM */}
          <TabsContent value="per_lm" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5">
                  <Wrench className="h-3 w-3" /> Fabrication ($/LM)
                </Label>
                <Input
                  type="number" min={0} step={10}
                  value={config.fabPerLm}
                  onChange={(e) => update({ fabPerLm: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5">
                  <HardHat className="h-3 w-3" /> Installation ($/LM)
                </Label>
                <Input
                  type="number" min={0} step={10}
                  value={config.installPerLm}
                  onChange={(e) => update({ installPerLm: Number(e.target.value) })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Per Unit */}
          <TabsContent value="per_unit" className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Cabinet Type</TableHead>
                    <TableHead className="text-xs text-center">Fab ($)</TableHead>
                    <TableHead className="text-xs text-center">Install ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cabinetTypes.map((t) => (
                    <TableRow key={t}>
                      <TableCell className="text-xs font-medium">{CABINET_TYPE_LABELS[t]}</TableCell>
                      <TableCell className="p-1.5">
                        <Input
                          type="number" min={0} step={5}
                          value={config.fabPerUnit[t]}
                          onChange={(e) => updatePerUnit("fabPerUnit", t, Number(e.target.value))}
                          className="text-center text-xs h-8"
                        />
                      </TableCell>
                      <TableCell className="p-1.5">
                        <Input
                          type="number" min={0} step={5}
                          value={config.installPerUnit[t]}
                          onChange={(e) => updatePerUnit("installPerUnit", t, Number(e.target.value))}
                          className="text-center text-xs h-8"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Live preview */}
        {breakdown && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Labour Estimate Preview</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fabrication</span>
              <span className="font-medium">${breakdown.fabTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Installation</span>
              <span className="font-medium">${breakdown.installTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-primary/20 pt-2">
              <span>Total Labour</span>
              <span className="text-kindai-pink">${(breakdown.fabTotal + breakdown.installTotal).toFixed(2)}</span>
            </div>
            {config.method === "hourly" && (
              <p className="text-[10px] text-muted-foreground mt-1">
                {breakdown.fabHours}hrs fab + {breakdown.installHours}hrs install = {(breakdown.fabHours + breakdown.installHours).toFixed(1)}hrs total
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
