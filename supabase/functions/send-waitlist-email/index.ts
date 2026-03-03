import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { waitlistId, emailType } = await req.json();
    if (!waitlistId || !["video", "trial_link"].includes(emailType)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: waitlist, error: waitlistError } = await supabase
      .from("waitlist")
      .select("id, email, contact_name, status")
      .eq("id", waitlistId)
      .single();

    if (waitlistError || !waitlist) {
      return new Response(JSON.stringify({ error: "Waitlist record not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const demoVideoUrl = "https://example.com/kindai-demo-video";
    const trialAccessUrl = `${Deno.env.get("PUBLIC_SITE_URL") ?? "https://example.com"}/auth?signup=true`;

    const content = emailType === "video"
      ? {
          subject: "Your Kindai demo is ready",
          html: `<p>Hi ${waitlist.contact_name},</p><p>Your Kindai demo is ready: <a href="${demoVideoUrl}">Watch demo</a>.</p><p>Next step: we can activate your 7-day trial after this 5-minute interactive demo.</p>`,
          status: "video_sent",
        }
      : {
          subject: "Your Kindai trial access is ready",
          html: `<p>Hi ${waitlist.contact_name},</p><p>Your Kindai 7-day trial is now ready. Access link: <a href="${trialAccessUrl}">Activate Trial</a>.</p><p>This follows your 5-minute interactive demo access flow.</p>`,
          status: "trial_sent",
        };

    if (resendApiKey) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Kindai Team <onboarding@resend.dev>",
          to: [waitlist.email],
          reply_to: "placeholder@kindai.ai",
          subject: content.subject,
          html: content.html,
        }),
      });

      if (!emailRes.ok) {
        const detail = await emailRes.text();
        return new Response(JSON.stringify({ error: `Email send failed: ${detail}` }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    await supabase.from("waitlist").update({ status: content.status }).eq("id", waitlistId);

    return new Response(JSON.stringify({ success: true, status: content.status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
