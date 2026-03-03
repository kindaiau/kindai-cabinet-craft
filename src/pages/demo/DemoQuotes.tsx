import { useState } from "react";
import { Download, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { generateQuotePdf, type QuoteData, type QuoteLineItem } from "@/lib/generate-quote-pdf";
import { DEMO_PROJECT, DEMO_CABINETS } from "@/contexts/DemoContext";
import { Link } from "react-router-dom";

export default function DemoQuotes() {
  const { toast } = useToast();

  const initialItems: QuoteLineItem[] = DEMO_CABINETS.map((c) => ({
    id: crypto.randomUUID(),
    description: `${c.label} (${c.type}, ${c.width_mm}mm)`,
    quantity: 1,
    unit: "ea",
    unitPrice: c.type === "tall" ? 1850 : c.type === "wall" ? 680 : 950,
  }));

  // Add materials
  initialItems.push(
    { id: crypto.randomUUID(), description: "18mm White Melamine Carcass — Polytec", quantity: 7, unit: "sheet", unitPrice: 89 },
    { id: crypto.randomUUID(), description: "16mm Doors — Bayliss Oak", quantity: 4, unit: "sheet", unitPrice: 145 },
    { id: crypto.randomUUID(), description: "ABS Edge Tape 1mm White", quantity: 45, unit: "m", unitPrice: 0.85 },
    { id: crypto.randomUUID(), description: "Blum Clip-Top Hinges", quantity: 16, unit: "ea", unitPrice: 12.5 },
    { id: crypto.randomUUID(), description: "Fabrication Labour", quantity: 1, unit: "lot", unitPrice: 2400 },
    { id: crypto.randomUUID(), description: "Installation Labour", quantity: 1, unit: "lot", unitPrice: 1200 },
  );

  const [quote] = useState<QuoteData>({
    businessName: "Smith Cabinetry",
    businessAbn: "12 345 678 901",
    businessAddress: "123 Workshop Rd, Melbourne VIC 3000",
    businessPhone: "0412 345 678",
    businessEmail: "info@smithcab.com.au",
    clientName: DEMO_PROJECT.client_name,
    clientAddress: DEMO_PROJECT.address,
    clientEmail: DEMO_PROJECT.client_email || "",
    quoteNumber: "Q-DEMO-001",
    quoteDate: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    projectName: DEMO_PROJECT.name,
    items: initialItems,
    notes: "• 50% deposit required to commence work\n• Balance due on completion\n• Quote valid for 30 days",
    gstRate: 10,
  });

  const subtotal = quote.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const gst = subtotal * (quote.gstRate / 100);
  const total = subtotal + gst;

  const handlePreview = () => {
    const doc = generateQuotePdf(quote);
    const blob = doc.output("blob");
    window.open(URL.createObjectURL(blob), "_blank");
  };

  const handleExportPdf = () => {
    const doc = generateQuotePdf(quote);
    doc.save(`${quote.quoteNumber}.pdf`);
    toast({ title: "PDF downloaded!", description: `${quote.quoteNumber}.pdf saved.` });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Quote Builder</h1>
          <p className="mt-1 text-muted-foreground">Professional quote for {DEMO_PROJECT.client_name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" /> Preview PDF
          </Button>
          <Button className="gradient-kindai border-0 font-semibold" onClick={handleExportPdf}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-base">Your Business</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold">{quote.businessName}</p>
            <p className="text-muted-foreground">ABN: {quote.businessAbn}</p>
            <p className="text-muted-foreground">{quote.businessAddress}</p>
            <p className="text-muted-foreground">{quote.businessPhone} · {quote.businessEmail}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-base">Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold">{quote.clientName}</p>
            <p className="text-muted-foreground">{quote.clientAddress}</p>
            <p className="text-muted-foreground">{quote.clientEmail}</p>
            <p className="text-muted-foreground">Quote #{quote.quoteNumber} · {quote.projectName}</p>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-base">Line Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="w-20 text-right">Qty</TableHead>
                  <TableHead className="w-20">Unit</TableHead>
                  <TableHead className="w-28 text-right">Unit Price</TableHead>
                  <TableHead className="w-28 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex flex-col items-end gap-1 text-sm">
            <div className="flex gap-8"><span className="text-muted-foreground">Subtotal</span><span className="font-medium w-28 text-right">${subtotal.toFixed(2)}</span></div>
            <div className="flex gap-8"><span className="text-muted-foreground">GST ({quote.gstRate}%)</span><span className="font-medium w-28 text-right">${gst.toFixed(2)}</span></div>
            <div className="h-px w-48 bg-border my-1" />
            <div className="flex gap-8"><span className="font-semibold">Total (inc. GST)</span><span className="font-display text-lg font-bold w-28 text-right text-primary">${total.toFixed(2)}</span></div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
        <h3 className="font-display font-semibold">Ready to build your own quotes?</h3>
        <p className="mt-1 text-sm text-muted-foreground">Sign up for a free trial and start estimating real jobs.</p>
        <Link to="/auth?signup=true">
          <Button className="mt-4 gradient-energy border-0 font-semibold shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
            Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
