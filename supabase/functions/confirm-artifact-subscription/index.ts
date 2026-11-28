const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, authorization, apikey", "Access-Control-Allow-Methods": "POST, OPTIONS" };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { token } = await request.json();
    if (!/^[0-9a-f-]{36}$/i.test(String(token || ""))) return json({ error: "Invalid confirmation link." }, 400);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const confirmed = await fetch(`${supabaseUrl}/rest/v1/artifact_subscribers?confirmation_token=eq.${token}`, {
      method: "PATCH",
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ confirmed_at: new Date().toISOString(), confirmation_token: null }),
    });
    if (!confirmed.ok) throw new Error("Could not confirm your subscription.");
    const rows = await confirmed.json();
    if (!rows.length) return json({ error: "This confirmation link has expired or was already used." }, 400);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not confirm your subscription." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
