const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, authorization, apikey", "Access-Control-Allow-Methods": "POST, OPTIONS" };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { token } = await request.json();
    if (!/^[0-9a-f-]{36}$/i.test(String(token || ""))) return json({ error: "Invalid unsubscribe link." }, 400);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const deleted = await fetch(`${supabaseUrl}/rest/v1/artifact_subscribers?unsubscribe_token=eq.${token}`, {
      method: "DELETE",
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Prefer: "return=representation" },
    });
    if (!deleted.ok) throw new Error("Unsubscribe failed.");
    return json({ ok: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unsubscribe failed." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
