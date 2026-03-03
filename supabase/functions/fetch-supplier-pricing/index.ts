import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SupplierConfig {
  name: string;
  slug: string;
  searchUrl: (query: string) => string;
}

const ALLOWED_SUPPLIER_SLUGS = ["bunnings", "polytec", "laminex"] as const;

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
    // --- Authentication ---
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Input Validation ---
    const body = await req.json();
    const { query, suppliers } = body;

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (query.length > 200) {
      return new Response(
        JSON.stringify({ success: false, error: "Query too long (max 200 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only allow alphanumeric, spaces, hyphens, and common punctuation
    if (!/^[a-zA-Z0-9\s\-_.,'&()]+$/.test(query)) {
      return new Response(
        JSON.stringify({ success: false, error: "Query contains invalid characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate suppliers array if provided
    if (suppliers !== undefined && suppliers !== null) {
      if (!Array.isArray(suppliers)) {
        return new Response(
          JSON.stringify({ success: false, error: "Suppliers must be an array" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const invalidSuppliers = suppliers.filter((s: unknown) => !ALLOWED_SUPPLIER_SLUGS.includes(s as any));
      if (invalidSuppliers.length > 0) {
        return new Response(
          JSON.stringify({ success: false, error: `Invalid suppliers: ${invalidSuppliers.join(", ")}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
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
          products: products.map((p: any) => ({
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
      JSON.stringify({ success: false, error: "An error occurred while fetching pricing" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
