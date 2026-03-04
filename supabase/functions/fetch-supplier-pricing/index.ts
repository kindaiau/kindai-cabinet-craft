import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SupplierConfig {
  name: string;
  slug: string;
  searchUrl: (query: string) => string;
}

interface SupplierProduct {
  name?: string;
  price?: number;
  unit?: string;
  sku?: string;
  description?: string;
}

const SUPPLIERS: SupplierConfig[] = [
  {
    name: "Bunnings",
    slug: "bunnings",
    searchUrl: (q) => `https://www.bunnings.com.au/search/products?q=${encodeURIComponent(q)}&sort=BoostOrder`,
  },
  {
    name: "Polytec",
    slug: "polytec",
    searchUrl: (q) => `https://www.polytec.com.au/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: "Laminex",
    slug: "laminex",
    searchUrl: (q) => `https://www.laminex.com.au/search?query=${encodeURIComponent(q)}`,
  },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, suppliers } = await req.json();
    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl connector not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const selectedSuppliers = suppliers?.length
      ? SUPPLIERS.filter((s) => suppliers.includes(s.slug))
      : SUPPLIERS;

    console.log(`Fetching pricing for "${query}" from ${selectedSuppliers.map((s) => s.name).join(", ")}`);

    // Scrape all suppliers in parallel
    const results = await Promise.allSettled(
      selectedSuppliers.map(async (supplier) => {
        const url = supplier.searchUrl(query);
        console.log(`Scraping ${supplier.name}: ${url}`);

        const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            formats: [
              {
                type: "json",
                prompt: `Extract product listings from this page. For each product found, extract: product name, price (as a number in AUD, without $ sign), unit (e.g. "each", "per m²", "per sheet", "per metre"), product code/SKU if available, and a short description. Return an array of products. If no products found, return an empty array.`,
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          price: { type: "number" },
                          unit: { type: "string" },
                          sku: { type: "string" },
                          description: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            ],
            waitFor: 3000,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error(`${supplier.name} error:`, data);
          return { supplier: supplier.name, slug: supplier.slug, products: [], error: data.error || "Scrape failed" };
        }

        const products = data?.data?.json?.products || data?.json?.products || [];
        console.log(`${supplier.name}: found ${products.length} products`);

        return {
          supplier: supplier.name,
          slug: supplier.slug,
          products: (products as SupplierProduct[]).map((p) => ({
            ...p,
            supplier: supplier.name,
            supplierSlug: supplier.slug,
          })),
        };
      })
    );

    const supplierResults = results.map((r) =>
      r.status === "fulfilled"
        ? r.value
        : { supplier: "Unknown", slug: "unknown", products: [], error: String((r as PromiseRejectedResult).reason) }
    );

    return new Response(
      JSON.stringify({ success: true, data: supplierResults }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
