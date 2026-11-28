const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { email } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return json({ error: "Enter a valid email address." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL")!;
    const sender = Deno.env.get("FROM_EMAIL")!;
    const resendKey = Deno.env.get("RESEND_API_KEY")!;

    const saved = await fetch(`${supabaseUrl}/rest/v1/artifact_subscribers?on_conflict=email`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({ email: normalizedEmail }),
    });
    if (!saved.ok) throw new Error("Could not save your subscription.");
    const rows = await saved.json();
    const token = rows[0]?.confirmation_token;
    if (rows[0]?.confirmed_at) return json({ ok: true, alreadySubscribed: true });
    if (!token) throw new Error("Could not create your subscription.");

    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender,
        to: [normalizedEmail],
        subject: "Confirm your research artifact updates",
        html: `<p>Confirm your email to receive new research artifact announcements.</p><p><a href="${siteUrl}/confirm-subscription.html?token=${token}">Confirm subscription</a></p><p style="color:#777;font-size:12px">If you didn’t request these updates, ignore this email.</p>`,
      }),
    });
    if (!sent.ok) throw new Error("Your address was saved, but the confirmation email could not be sent. Please try again later.");
    return json({ ok: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Subscription failed." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
