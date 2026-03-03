import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, contact_name, business_name } = await req.json();

    if (!email || !contact_name || !business_name) {
      return new Response(
        JSON.stringify({ error: "email, contact_name, and business_name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send confirmation email to the applicant
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kindai <noreply@kindai.com.au>",
        to: [email],
        subject: "You're on the Kindai waitlist 🎉",
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #e0e0e0; border-radius: 12px;">
            <h1 style="font-size: 24px; color: #4dd9e8; margin-bottom: 16px;">Welcome to the Kindai Waitlist</h1>
            <p>Hey ${contact_name},</p>
            <p>Thanks for registering <strong>${business_name}</strong> on the Kindai waitlist.</p>
            <p>We'll be in touch soon with a personalised demo video showing how Kindai can save your shop time and money on cabinet estimates.</p>
            <p style="margin-top: 24px; color: #999;">— The Kindai Team</p>
          </div>
        `,
      }),
    });

    const emailData = await emailRes.text();

    if (!emailRes.ok) {
      console.error("Resend error:", emailData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
