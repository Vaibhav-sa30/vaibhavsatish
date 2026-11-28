const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, authorization", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (request.headers.get("Authorization") !== `Bearer ${Deno.env.get("ARTIFACT_NOTIFY_SECRET")}`) return json({ error: "Unauthorized" }, 401);

  try {
    const { title, url, summary } = await request.json();
    if (!title || !url || !summary) return json({ error: "Provide a title, HTTPS URL, and summary." }, 400);
    const artifactUrl = new URL(String(url));
    if (artifactUrl.protocol !== "https:") return json({ error: "The artifact URL must use HTTPS." }, 400);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const recipientsResponse = await fetch(`${supabaseUrl}/rest/v1/artifact_subscribers?select=email,unsubscribe_token&confirmed_at=not.is.null`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    if (!recipientsResponse.ok) throw new Error("Could not load subscribers.");
    const recipients = await recipientsResponse.json();
    const sender = Deno.env.get("FROM_EMAIL")!;
    const resendKey = Deno.env.get("RESEND_API_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL")!;
    const safeTitle = escapeHtml(String(title));
    const safeSummary = escapeHtml(String(summary));
    const safeUrl = escapeHtml(artifactUrl.toString());
    let sentCount = 0;
    for (const recipient of recipients) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: sender,
          to: [recipient.email],
          subject: `New research artifact: ${String(title).slice(0, 120)}`,
          html: `<h1>${safeTitle}</h1><p>${safeSummary}</p><p><a href="${safeUrl}">View the artifact →</a></p><p style="color:#777;font-size:12px">You received this because you subscribed to research updates. <a href="${siteUrl}/unsubscribe.html?token=${recipient.unsubscribe_token}">Unsubscribe</a>.</p>`,
        }),
      });
      if (response.ok) sentCount++;
    }
    return json({ ok: true, sent: sentCount, total: recipients.length });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not send artifact update." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
