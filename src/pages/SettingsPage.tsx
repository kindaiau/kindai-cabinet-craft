import { useState, useEffect } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LabourConfigPanel from "@/components/quotes/LabourConfigPanel";
import {
  type LabourConfig,
  DEFAULT_LABOUR_CONFIG,
} from "@/lib/labour-engine";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [tradeType, setTradeType] = useState("");
  const [wasteFactor, setWasteFactor] = useState(12);
  const [labourConfig, setLabourConfig] = useState<LabourConfig>(DEFAULT_LABOUR_CONFIG);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setBusinessName(data.business_name ?? "");
        setLocation(data.location ?? "");
        setTradeType(data.trade_type ?? "");
        setWasteFactor(data.default_waste_factor ?? 12);
        setLabourConfig({
          method: (data as any).labour_method ?? DEFAULT_LABOUR_CONFIG.method,
          fabHourlyRate: (data as any).fab_hourly_rate ?? DEFAULT_LABOUR_CONFIG.fabHourlyRate,
          installHourlyRate: (data as any).install_hourly_rate ?? DEFAULT_LABOUR_CONFIG.installHourlyRate,
          fabPerLm: (data as any).fab_per_lm ?? DEFAULT_LABOUR_CONFIG.fabPerLm,
          installPerLm: (data as any).install_per_lm ?? DEFAULT_LABOUR_CONFIG.installPerLm,
          fabPerUnit: (data as any).fab_per_unit ?? DEFAULT_LABOUR_CONFIG.fabPerUnit,
          installPerUnit: (data as any).install_per_unit ?? DEFAULT_LABOUR_CONFIG.installPerUnit,
          fabHoursPerUnit: (data as any).fab_hours_per_unit ?? DEFAULT_LABOUR_CONFIG.fabHoursPerUnit,
          installHoursPerUnit: (data as any).install_hours_per_unit ?? DEFAULT_LABOUR_CONFIG.installHoursPerUnit,
        });
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not logged in", variant: "destructive" });
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: businessName || null,
        location: location || null,
        trade_type: tradeType || null,
        default_waste_factor: wasteFactor,
        labour_method: labourConfig.method,
        fab_hourly_rate: labourConfig.fabHourlyRate,
        install_hourly_rate: labourConfig.installHourlyRate,
        fab_per_lm: labourConfig.fabPerLm,
        install_per_lm: labourConfig.installPerLm,
        fab_per_unit: labourConfig.fabPerUnit as any,
        install_per_unit: labourConfig.installPerUnit as any,
        fab_hours_per_unit: labourConfig.fabHoursPerUnit as any,
        install_hours_per_unit: labourConfig.installHoursPerUnit as any,
      } as any)
      .eq("user_id", user.id);

    setSaving(false);
    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved!" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your profile, defaults &amp; labour rates</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-kindai border-0 font-semibold">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      {/* Profile */}
      <Card className="mt-8">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-kindai-violet" /> Business Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Business Name</Label>
            <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Smith Cabinetry" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Melbourne, VIC" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Trade Type</Label>
              <Input value={tradeType} onChange={(e) => setTradeType(e.target.value)} placeholder="Cabinet Maker" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Default Waste Factor (%)</Label>
            <Input type="number" min={0} max={50} value={wasteFactor} onChange={(e) => setWasteFactor(Number(e.target.value))} className="w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Labour Defaults */}
      <div className="mt-6">
        <LabourConfigPanel config={labourConfig} onConfigChange={setLabourConfig} />
      </div>
    </div>
  );
}
