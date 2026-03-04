import { useState, useEffect } from "react";
import { Download, Plus, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { generateQuotePdf, type QuoteData, type QuoteLineItem } from "@/lib/generate-quote-pdf";
import LabourConfigPanel from "@/components/quotes/LabourConfigPanel";
import ProjectSelector from "@/components/quotes/ProjectSelector";
import {
  type LabourConfig,
  type LabourMethod,
  type CabinetInput,
  type PricePerUnit,
  type HoursPerUnit,
  DEFAULT_LABOUR_CONFIG,
  calculateLabour,
} from "@/lib/labour-engine";
import { supabase } from "@/integrations/supabase/client";
import { ConfidenceChip } from "@/components/trust/ConfidenceChip";
import { AssumptionBlock } from "@/components/trust/AssumptionBlock";
import { ReviewGateBanner } from "@/components/trust/ReviewGateBanner";

const defaultItem = (): QuoteLineItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unit: "ea",
  unitPrice: 0,
});

interface SelectedProject {
  name: string;
  client_name: string | null;
  client_email: string | null;
  address: string | null;
}

interface SelectedCabinet {
  label: string;
  type: string;
  width_mm: number;
  count: number;
}

export default function QuoteBuilder() {
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData>({
    businessName: "",
    businessAbn: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    quoteNumber: `Q-${Date.now().toString(36).toUpperCase()}`,
    quoteDate: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    projectName: "",
    items: [defaultItem()],
    notes: "• 50% deposit required to commence work\n• Balance due on completion\n• Quote valid for 30 days",
    gstRate: 10,
  });

  const [labourConfig, setLabourConfig] = useState<LabourConfig>(DEFAULT_LABOUR_CONFIG);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Load saved labour defaults from profile on mount
  useEffect(() => {
    const loadDefaults = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("labour_method, fab_hourly_rate, install_hourly_rate, fab_per_lm, install_per_lm, fab_per_unit, install_per_unit, fab_hours_per_unit, install_hours_per_unit, business_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!profile) return;
      setLabourConfig({
        method: profile.labour_method as LabourMethod,
        fabHourlyRate: Number(profile.fab_hourly_rate),
        installHourlyRate: Number(profile.install_hourly_rate),
        fabPerLm: Number(profile.fab_per_lm),
        installPerLm: Number(profile.install_per_lm),
        fabPerUnit: profile.fab_per_unit as unknown as PricePerUnit,
        installPerUnit: profile.install_per_unit as unknown as PricePerUnit,
        fabHoursPerUnit: profile.fab_hours_per_unit as unknown as HoursPerUnit,
        installHoursPerUnit: profile.install_hours_per_unit as unknown as HoursPerUnit,
      });
      if (profile.business_name) {
        setQuote((prev) => ({ ...prev, businessName: prev.businessName || profile.business_name || "" }));
      }
    };
    loadDefaults();
  }, []);

  const handleProjectSelected = (project: SelectedProject | null, cabinets: SelectedCabinet[]) => {
    if (!project) return;
    setQuote((prev) => ({
      ...prev,
      clientName: project.client_name || prev.clientName,
      clientAddress: project.address || prev.clientAddress,
      clientEmail: project.client_email || prev.clientEmail,
      projectName: project.name || prev.projectName,
      items: cabinets.length > 0
        ? cabinets.map((c) => ({
            id: crypto.randomUUID(),
            description: `${c.label} (${c.type}, ${c.width_mm}mm)`,
            quantity: c.count,
            unit: "ea",
            unitPrice: 0,
          }))
        : prev.items,
    }));
  };


  const cabinetInputs: CabinetInput[] = quote.items
    .filter((i) => i.description && /cabinet|base|wall|tall|pantry|drawer|overhead/i.test(i.description))
    .map((i) => ({
      type: i.description,
      width_mm: 600, // default; could be parsed from description
      quantity: i.quantity,
    }));

  const labourBreakdown = cabinetInputs.length > 0 ? calculateLabour(cabinetInputs, labourConfig) : null;

  const updateField = <K extends keyof QuoteData>(field: K, value: QuoteData[K]) =>
    setQuote((prev) => ({ ...prev, [field]: value }));

  const updateItem = <K extends keyof QuoteLineItem>(id: string, field: K, value: QuoteLineItem[K]) =>
    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));

  const addItem = () => setQuote((prev) => ({ ...prev, items: [...prev.items, defaultItem()] }));
  const removeItem = (id: string) =>
    setQuote((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));

  const subtotal = quote.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const labourFab = labourBreakdown?.fabTotal ?? 0;
  const labourInstall = labourBreakdown?.installTotal ?? 0;
  const labourTotal = labourFab + labourInstall;
  const preGstTotal = subtotal + labourTotal;
  const gst = preGstTotal * (quote.gstRate / 100);
  const total = preGstTotal + gst;

  const hasEmptyDescriptions = quote.items.some((item) => !item.description.trim());
  const hasZeroPriceItems = quote.items.some((item) => item.description.trim() && item.unitPrice <= 0);
  const assumptions: string[] = [];

  if (cabinetInputs.length > 0) {
    assumptions.push("Cabinet width defaults to 600mm when dimensions are not provided.");
  }

  if (!quote.clientEmail) {
    assumptions.push("Client email is missing and will need confirmation before sending.");
  }

  if (!quote.businessAbn) {
    assumptions.push("ABN not provided yet. Add this before issuing a formal quote.");
  }

  const requiresManualReview = hasEmptyDescriptions || hasZeroPriceItems;
  const confidenceLevel: "high" | "medium" | "low" = requiresManualReview
    ? "low"
    : assumptions.length > 0
      ? "medium"
      : "high";

  const buildExportData = (): QuoteData => {
    // Append labour as line items for PDF
    const labourItems: QuoteLineItem[] = [];
    if (labourBreakdown) {
      if (labourBreakdown.fabTotal > 0) {
        labourItems.push({
          id: "labour-fab",
          description: labourBreakdown.fabLineLabel,
          quantity: 1,
          unit: "lot",
          unitPrice: labourBreakdown.fabTotal,
        });
      }
      if (labourBreakdown.installTotal > 0) {
        labourItems.push({
          id: "labour-install",
          description: labourBreakdown.installLineLabel,
          quantity: 1,
          unit: "lot",
          unitPrice: labourBreakdown.installTotal,
        });
      }
    }
    return { ...quote, items: [...quote.items.filter((i) => i.description), ...labourItems] };
  };

  const handleExportPdf = async () => {
    const data = buildExportData();
    if (data.items.length === 0) {
      toast({ title: "Add at least one line item", variant: "destructive" });
      return;
    }

    try {
      setPdfLoading(true);
      const doc = await generateQuotePdf(data);
      doc.save(`${quote.quoteNumber}.pdf`);
      toast({ title: "PDF downloaded!", description: `${quote.quoteNumber}.pdf saved.` });
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePreview = async () => {
    const data = buildExportData();
    if (data.items.length === 0) {
      toast({ title: "Add at least one line item", variant: "destructive" });
      return;
    }

    try {
      setPdfLoading(true);
      const doc = await generateQuotePdf(data);
      const blob = doc.output("blob");
      window.open(URL.createObjectURL(blob), "_blank");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Quote Builder</h1>
          <p className="mt-1 text-muted-foreground">Create professional quotes for your clients</p>
          <div className="mt-3">
            <ConfidenceChip level={confidenceLevel} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview} disabled={pdfLoading}>
            <Eye className="mr-2 h-4 w-4" /> {pdfLoading ? "Preparing..." : "Preview"}
          </Button>
          <Button className="gradient-kindai border-0 font-semibold" onClick={handleExportPdf} disabled={pdfLoading}>
            <Download className="mr-2 h-4 w-4" /> {pdfLoading ? "Preparing..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Your Business */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-base">Your Business</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Business Name</Label>
              <Input value={quote.businessName} onChange={(e) => updateField("businessName", e.target.value)} placeholder="Smith Cabinetry" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ABN</Label>
              <Input value={quote.businessAbn} onChange={(e) => updateField("businessAbn", e.target.value)} placeholder="12 345 678 901" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Input value={quote.businessAddress} onChange={(e) => updateField("businessAddress", e.target.value)} placeholder="123 Workshop Rd, Melbourne VIC 3000" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input value={quote.businessPhone} onChange={(e) => updateField("businessPhone", e.target.value)} placeholder="0412 345 678" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input value={quote.businessEmail} onChange={(e) => updateField("businessEmail", e.target.value)} placeholder="info@smithcab.com.au" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Details */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-base">Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProjectSelector onProjectSelected={handleProjectSelected} />
            <div className="space-y-1.5">
              <Label className="text-xs">Client Name</Label>
              <Input value={quote.clientName} onChange={(e) => updateField("clientName", e.target.value)} placeholder="Jane Builder" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Address</Label>
              <Input value={quote.clientAddress} onChange={(e) => updateField("clientAddress", e.target.value)} placeholder="456 Client St, Sydney NSW 2000" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input value={quote.clientEmail} onChange={(e) => updateField("clientEmail", e.target.value)} placeholder="jane@example.com" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Quote #</Label>
                <Input value={quote.quoteNumber} onChange={(e) => updateField("quoteNumber", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Date</Label>
                <Input type="date" value={quote.quoteDate} onChange={(e) => updateField("quoteDate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Valid Until</Label>
                <Input type="date" value={quote.validUntil} onChange={(e) => updateField("validUntil", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Project Name</Label>
              <Input value={quote.projectName} onChange={(e) => updateField("projectName", e.target.value)} placeholder="Kitchen renovation — 42 Oak Ave" />
            </div>
          </CardContent>
        </Card>
      </div>

      {requiresManualReview && (
        <div className="mt-6">
          <ReviewGateBanner description="Some line items are incomplete or priced at $0.00. Review these before sharing the quote." />
        </div>
      )}

      {/* Line Items */}
      <Card className="mt-6">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="font-display text-base">Line Items</CardTitle>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="w-20">Qty</TableHead>
                  <TableHead className="w-24">Unit</TableHead>
                  <TableHead className="w-28">Unit Price</TableHead>
                  <TableHead className="w-28 text-right">Total</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="p-1.5">
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder="18mm White Melamine Carcass"
                        className="border-0 bg-transparent shadow-none focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        type="number" min={0}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        className="border-0 bg-transparent shadow-none focus-visible:ring-1 text-center"
                      />
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                        className="border-0 bg-transparent shadow-none focus-visible:ring-1 text-center"
                      />
                    </TableCell>
                    <TableCell className="p-1.5">
                      <Input
                        type="number" min={0} step={0.01}
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                        className="border-0 bg-transparent shadow-none focus-visible:ring-1 text-right"
                      />
                    </TableCell>
                    <TableCell className="p-1.5 text-right font-medium">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </TableCell>
                    <TableCell className="p-1.5">
                      {quote.items.length > 1 && (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Materials Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {labourBreakdown && labourBreakdown.fabTotal > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Fabrication Labour</span>
                  <span>${labourFab.toFixed(2)}</span>
                </div>
              )}
              {labourBreakdown && labourBreakdown.installTotal > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Installation Labour</span>
                  <span>${labourInstall.toFixed(2)}</span>
                </div>
              )}
              {labourTotal > 0 && (
                <div className="flex justify-between text-muted-foreground border-t border-border pt-1">
                  <span>Pre-GST Total</span>
                  <span>${preGstTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-2">
                  GST
                  <Input
                    type="number" min={0}
                    value={quote.gstRate}
                    onChange={(e) => updateField("gstRate", Number(e.target.value))}
                    className="h-7 w-14 text-center text-xs"
                  />
                  %
                </span>
                <span>${gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold text-kindai-pink">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Labour Config */}
      <div className="mt-6">
        <LabourConfigPanel
          config={labourConfig}
          onConfigChange={setLabourConfig}
          cabinets={cabinetInputs}
        />
      </div>

      {assumptions.length > 0 && (
        <AssumptionBlock className="mt-6" items={assumptions} />
      )}

      {/* Notes */}
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-base">Notes & Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            value={quote.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Payment terms, conditions, or additional notes..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
