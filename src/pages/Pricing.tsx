import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Search, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

interface Product {
  name: string;
  price: number;
  unit: string;
  sku?: string;
  description?: string;
  supplier: string;
  supplierSlug: string;
}

interface SupplierResult {
  supplier: string;
  slug: string;
  products: Product[];
  error?: string;
}

const SUPPLIERS = [
  { slug: "bunnings", name: "Bunnings", color: "bg-kindai-green/10 text-kindai-green" },
  { slug: "polytec", name: "Polytec", color: "bg-kindai-blue/10 text-kindai-blue" },
  { slug: "laminex", name: "Laminex", color: "bg-kindai-orange/10 text-kindai-orange" },
];

export default function Pricing() {
  const [query, setQuery] = useState("");
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(SUPPLIERS.map((s) => s.slug));
  const [results, setResults] = useState<SupplierResult[]>([]);

  const toggleSupplier = (slug: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const { mutate: fetchPricing, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-supplier-pricing", {
        body: { query, suppliers: selectedSuppliers },
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      return data.data as SupplierResult[];
    },
    onSuccess: (data) => {
      setResults(data);
      const total = data.reduce((sum, s) => sum + s.products.length, 0);
      trackEvent("checkout_completed", { source: "pricing_compare", productsFound: total });
      toast.success(`Found ${total} products across ${data.length} suppliers`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to fetch pricing");
    },
  });

  const allProducts = results
    .flatMap((r) => r.products)
    .sort((a, b) => (a.price || Infinity) - (b.price || Infinity));

  const supplierColor = (slug: string) =>
    SUPPLIERS.find((s) => s.slug === slug)?.color || "bg-muted text-muted-foreground";

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <h1 className="font-display text-3xl font-bold">Live Pricing</h1>
      <p className="mt-1 text-muted-foreground">
        Compare supplier pricing across Bunnings, Polytec &amp; Laminex
      </p>

      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim() && selectedSuppliers.length > 0) fetchPricing();
        }}
        className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-1.5">
          <Label>Search Materials</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 16mm white melamine board"
              className="pl-9"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending || !query.trim() || selectedSuppliers.length === 0}
          className="gradient-kindai border-0 font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…
            </>
          ) : (
            <>
              <DollarSign className="mr-2 h-4 w-4" /> Fetch Prices
            </>
          )}
        </Button>
      </form>

      {/* Supplier toggles */}
      <div className="mt-4 flex flex-wrap gap-4">
        {SUPPLIERS.map((s) => (
          <div key={s.slug} className="flex items-center gap-2">
            <Checkbox
              id={s.slug}
              checked={selectedSuppliers.includes(s.slug)}
              onCheckedChange={() => toggleSupplier(s.slug)}
            />
            <Label htmlFor={s.slug} className="text-sm cursor-pointer">
              {s.name}
            </Label>
          </div>
        ))}
      </div>

      {/* Loading state */}
      {isPending && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Scraping live pricing from {selectedSuppliers.length} suppliers…
          </p>
          <p className="text-xs text-muted-foreground mt-1">This may take 15–30 seconds</p>
        </div>
      )}

      {/* Empty state */}
      {!isPending && allProducts.length === 0 && results.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-kindai-green/10 p-6">
            <DollarSign className="h-12 w-12 text-kindai-green" />
          </div>
          <h2 className="mt-6 font-display text-xl font-semibold">Search for materials</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Enter a material name above to fetch live pricing from Australian suppliers.
          </p>
        </div>
      )}

      {/* Errors */}
      {results.filter((r) => r.error).length > 0 && (
        <div className="mt-4 space-y-2">
          {results
            .filter((r) => r.error)
            .map((r) => (
              <div
                key={r.slug}
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
              >
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span>
                  <strong>{r.supplier}</strong>: {r.error}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Results summary cards */}
      {allProducts.length > 0 && (
        <>
          <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
            <SummaryCard
              label="Total Products"
              value={allProducts.length}
              color="kindai-blue"
            />
            <SummaryCard
              label="Lowest Price"
              value={`$${Math.min(...allProducts.filter((p) => p.price > 0).map((p) => p.price)).toFixed(2)}`}
              color="kindai-green"
            />
            <SummaryCard
              label="Highest Price"
              value={`$${Math.max(...allProducts.filter((p) => p.price > 0).map((p) => p.price)).toFixed(2)}`}
              color="kindai-orange"
            />
            <SummaryCard
              label="Suppliers"
              value={results.filter((r) => r.products.length > 0).length}
              color="kindai-pink"
            />
          </div>

          {/* Results table */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-kindai-green" />
                Price Comparison — "{query}"
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Price (AUD)</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProducts.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Badge variant="secondary" className={supplierColor(p.supplierSlug)}>
                          {p.supplier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[280px] truncate">
                        {p.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {p.sku || "—"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {p.price > 0 ? `$${p.price.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.unit || "each"}</TableCell>
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

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`font-display text-2xl font-bold text-${color} mt-1`}>{value}</p>
      </CardContent>
    </Card>
  );
}
