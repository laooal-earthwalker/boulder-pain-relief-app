/**
 * POST /api/webhooks/acuity
 *
 * Receives appointment event webhooks from Acuity Scheduling.
 *
 * HIPAA requirements:
 *  - Validates HMAC-SHA256 signature before processing any data
 *  - Looks up client by email — uses only user ID internally after lookup
 *  - Sends ONLY anonymized pain pattern data to Claude (no name, no email)
 *  - Logs webhook receipt to audit_logs (no PHI in log)
 *  - No console.log of client email or health data
 *
 * Setup required (manual):
 *  1. In Acuity: Integrations → Webhooks → Add webhook URL
 *     URL: https://yourdomain.com/api/webhooks/acuity
 *     Events: appointment.scheduled, appointment.rescheduled
 *  2. Set ACUITY_WEBHOOK_SECRET in .env.local
 *  3. Set ACUITY_PRACTITIONER_USER_ID in .env.local (your Supabase user ID)
 */

import { createClient } from "@/lib/supabase/server";
import { anthropic } from "@/lib/anthropic";
import { PATTERN_SUMMARY_PROMPT } from "@/lib/ai/systemPrompt";
import { logAuditEvent } from "@/lib/hipaa/auditLog";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";

// ── Signature validation ───────────────────────────────────────────────────────

function validateAcuitySignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.ACUITY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  const provided = signatureHeader.replace(/^sha256=/, "");

  // Constant-time comparison to prevent timing attacks
  if (expected.length !== provided.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}

// ── 90-day pattern summary helper ─────────────────────────────────────────────

async function generatePatternSummary(
  reports: Array<{
    reported_at: string;
    spots: unknown;
    activity_notes: unknown;
    ai_interpretation: unknown;
  }>
): Promise<unknown> {
  // Send only anonymized pattern data — no names, no emails
  const anonymized = reports.map((r) => ({
    reported_at: r.reported_at,
    spots: r.spots,
    activity_notes: r.activity_notes,
    ai_interpretation: r.ai_interpretation,
  }));

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: PATTERN_SUMMARY_PROMPT,
    messages: [
      {
        role: "user",
        content: JSON.stringify(anonymized),
      },
    ],
  });

  const raw =
    message.content[0]?.type === "text" ? message.content[0].text : "{}";

  try {
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return { session_note: "Pattern analysis unavailable for this session." };
  }
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // Read raw body for signature verification — must happen before .json()
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-acuity-signature-256");

  // ── 1. Validate signature ─────────────────────────────────────────────────
  if (!validateAcuitySignature(rawBody, signatureHeader)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── 2. Parse payload ──────────────────────────────────────────────────────
  let payload: { email?: string; datetime?: string; id?: number };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.email || !payload.datetime || !payload.id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();

  // ── 3. Look up client by email ────────────────────────────────────────────
  // After this point we work only with client_id (UUID), never the email
  const { data: profile } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("email", payload.email)
    .single();

  // Upsert appointment regardless of whether the client has a profile
  const appointmentAt = new Date(payload.datetime).toISOString();
  const acuityId = String(payload.id);

  if (!profile) {
    // Client has no account yet — store appointment without client_id
    await supabase.from("appointments").upsert(
      {
        acuity_appointment_id: acuityId,
        appointment_at: appointmentAt,
        client_id: null,
        summary_json: null,
      },
      { onConflict: "acuity_appointment_id" }
    );
    return NextResponse.json({ ok: true, matched: false });
  }

  const clientId = profile.id;

  // ── 4. Pull last 90 days of pain reports (anonymized query) ───────────────
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: reports } = await supabase
    .from("pain_reports")
    .select("reported_at, spots, activity_notes, ai_interpretation")
    .eq("client_id", clientId)
    .gte("reported_at", ninetyDaysAgo.toISOString())
    .order("reported_at", { ascending: false });

  // ── 5. Generate AI pattern summary ────────────────────────────────────────
  let summaryJson: unknown = null;
  if (reports && reports.length > 0 && process.env.ANTHROPIC_API_KEY) {
    try {
      summaryJson = await generatePatternSummary(reports);
    } catch {
      // Non-fatal — store appointment without summary
    }
  }

  // ── 6. Store appointment ──────────────────────────────────────────────────
  await supabase.from("appointments").upsert(
    {
      acuity_appointment_id: acuityId,
      appointment_at: appointmentAt,
      client_id: clientId,
      summary_json: summaryJson,
    },
    { onConflict: "acuity_appointment_id" }
  );

  // ── 7. Audit log (practitioner user ID, no client PHI) ───────────────────
  const practitionerId = process.env.ACUITY_PRACTITIONER_USER_ID;
  if (practitionerId) {
    await logAuditEvent(practitionerId, "appointment_webhook_received", "acuity");
  }

  return NextResponse.json({ ok: true, matched: true });
}
