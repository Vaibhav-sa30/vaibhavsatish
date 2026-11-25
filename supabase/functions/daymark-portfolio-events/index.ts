import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedTypes = new Set([
  "checkin_completed", "update_submitted", "proposal_generated", "ai_proposal_failed", "branch_created",
  "preview_deployment_ready", "update_refined", "update_approved",
  "production_deployment_completed", "update_discarded", "deployment_failed",
]);
const allowedResponses = new Set(["has_update", "nothing_to_update"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function constantTimeEqual(left: string, right: string): boolean {
  let difference = left.length ^ right.length;
  const count = Math.max(left.length, right.length);
  for (let index = 0; index < count; index++) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return response({ error: "method_not_allowed" }, 405);
  const expectedToken = Deno.env.get("DAYMARK_INGEST_TOKEN") ?? "";
  const suppliedToken = request.headers.get("X-Daymark-Token") ?? "";
  if (!expectedToken || !constantTimeEqual(suppliedToken, expectedToken)) {
    return response({ error: "unauthorized" }, 401);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > 16_384) return response({ error: "payload_too_large" }, 413);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 16_384) return response({ error: "payload_too_large" }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) return response({ error: "invalid_payload" }, 400);
    body = parsed;
  } catch {
    return response({ error: "invalid_json" }, 400);
  }

  const eventId = body.event_id;
  const eventType = body.event_type;
  const createdAt = body.created_at;
  const metadata = body.metadata ?? {};
  const updateId = body.update_id;
  if (typeof eventId !== "string" || !uuidPattern.test(eventId) ||
      typeof eventType !== "string" || !allowedTypes.has(eventType) ||
      typeof createdAt !== "string" || !isoPattern.test(createdAt) ||
      !Number.isFinite(Date.parse(createdAt)) || !isPlainObject(metadata) ||
      (updateId !== null && updateId !== undefined &&
        (typeof updateId !== "string" || updateId.length > 100))) {
    return response({ error: "invalid_event" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return response({ error: "server_not_configured" }, 503);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (eventType === "checkin_completed") {
    const responseValue = metadata.response;
    const source = metadata.source;
    const checkinId = metadata.checkin_id;
    if (typeof responseValue !== "string" || !allowedResponses.has(responseValue) ||
        typeof source !== "string" || source.length > 40 ||
        typeof checkinId !== "string" || !uuidPattern.test(checkinId)) {
      return response({ error: "invalid_checkin" }, 400);
    }
    const { error: checkinError } = await supabase.from("portfolio_checkins").upsert({
      id: checkinId, response: responseValue, source, created_at: createdAt, metadata,
    }, { onConflict: "id", ignoreDuplicates: true });
    if (checkinError) return response({ error: "storage_failed" }, 502);
  }

  const { error } = await supabase.from("portfolio_update_events").upsert({
    event_id: eventId,
    update_id: typeof updateId === "string" ? updateId : null,
    event_type: eventType,
    metadata,
    created_at: createdAt,
  }, { onConflict: "event_id", ignoreDuplicates: true });
  if (error) return response({ error: "storage_failed" }, 502);
  return response({ ok: true, event_id: eventId });
});






