import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { planId } = await req.json();
    if (!planId) throw new Error("planId is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the plan record
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) throw new Error("Plan not found");

    // Update status to analyzing
    await supabase.from("plans").update({ status: "analyzing" }).eq("id", planId);

    // Get a signed URL for the file
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("plans")
      .createSignedUrl(plan.file_path, 300);

    if (signedUrlError || !signedUrlData) throw new Error("Could not get file URL");

    // Download the image and convert to base64
    const imageResponse = await fetch(signedUrlData.signedUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    const mimeType = plan.file_type || "image/png";

    // Call Gemini vision via Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are an expert Australian cabinet maker and quantity surveyor. Analyze the provided floor plan, elevation, or sketch image and extract all cabinetry information.

Return your analysis using the extract_cabinets tool.

For each cabinet found:
- Give it a descriptive label (e.g. "Base Cabinet - Sink", "Wall Cabinet - Left", "Pantry Tower")
- Estimate dimensions in mm (width, height, depth) based on Australian standards if not labeled
- Identify the cabinet type: base, wall, tall, island, vanity, overhead
- Note any special features: drawers, doors, sink cutout, appliance housing, corner unit, pull-out bins
- Estimate materials needed: carcass sheets, doors/fronts, shelves, hinges, drawer runners

Australian standard depths: Base 560mm, Wall 300mm, Tall 560mm. Standard heights: Base 720mm, Wall 720mm, Tall 2100mm.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this plan and extract all cabinets with their dimensions, types, and material requirements."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_cabinets",
              description: "Extract cabinet data from the analyzed plan image",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "Brief summary of what the plan shows (e.g. 'Kitchen floor plan with L-shaped layout')"
                  },
                  room_type: {
                    type: "string",
                    enum: ["kitchen", "bathroom", "laundry", "wardrobe", "office", "other"]
                  },
                  cabinets: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        type: { type: "string", enum: ["base", "wall", "tall", "island", "vanity", "overhead"] },
                        width_mm: { type: "number" },
                        height_mm: { type: "number" },
                        depth_mm: { type: "number" },
                        features: {
                          type: "array",
                          items: { type: "string" }
                        },
                        door_count: { type: "number" },
                        drawer_count: { type: "number" },
                        shelf_count: { type: "number" }
                      },
                      required: ["label", "type", "width_mm", "height_mm", "depth_mm"]
                    }
                  },
                  total_linear_metres: { type: "number" },
                  estimated_carcass_sheets: { type: "number" },
                  notes: { type: "string" }
                },
                required: ["summary", "room_type", "cabinets"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_cabinets" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        await supabase.from("plans").update({ status: "error", analysis: { error: "Rate limited, please try again later" } }).eq("id", planId);
        return new Response(JSON.stringify({ error: "Rate limited, please try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (aiResponse.status === 402) {
        await supabase.from("plans").update({ status: "error", analysis: { error: "AI credits exhausted" } }).eq("id", planId);
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      await supabase.from("plans").update({ status: "error", analysis: { error: "AI analysis failed" } }).eq("id", planId);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    let analysis;

    // Extract from tool call response
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      analysis = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try to parse from content
      const content = aiData.choices?.[0]?.message?.content || "";
      try {
        analysis = JSON.parse(content);
      } catch {
        analysis = { summary: content, room_type: "other", cabinets: [], notes: "Could not parse structured data" };
      }
    }

    // Update plan with analysis
    await supabase.from("plans").update({
      status: "analyzed",
      analysis
    }).eq("id", planId);

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("analyze-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
