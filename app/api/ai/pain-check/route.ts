/**
 * POST /api/ai/pain-check
 *
 * HIPAA requirements enforced here:
 *  - Auth check before any processing
 *  - PHI stripped via sanitizeSpotsForAI() before the Claude call
 *  - Only clinical content (region label, intensity, activity text) sent to Claude
 *  - No client name, email, or user ID ever sent to the external API
 *  - Action logged to audit_logs (user ID + action type only, no PHI)
 *  - No console.log of PHI anywhere in this file
 */

import { anthropic } from "@/lib/anthropic";
import { createClient } from "@/lib/supabase/server";
import { CLINICAL_SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";
import { sanitizeSpotsForAI, assertNoPHI } from "@/lib/hipaa/sanitize";
import { logAuditEvent, getClientIp } from "@/lib/hipaa/auditLog";

interface IncomingSpot {
  label?: string;
  intensity?: number;
  activityText?: string;
  size?: string;
  [key: string]: unknown;
}

interface RequestBody {
  spots: IncomingSpot[];
  duration?: string;
}

export async function POST(request: Request) {
  // ── 1. Auth check — reject immediately if not authenticated ────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Parse and validate input ────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!Array.isArray(body.spots) || body.spots.length === 0) {
    return Response.json(
      { error: "At least one pain region is required." },
      { status: 422 }
    );
  }

  if (body.spots.length > 10) {
    return Response.json(
      { error: "Maximum 10 pain regions per assessment." },
      { status: 422 }
    );
  }

  // ── 3. Sanitize — strip all PHI before building the Claude payload ─────────
  const sanitized = sanitizeSpotsForAI(body.spots);

  // Guard: verify no PHI slipped through in activity text
  try {
    assertNoPHI(
      sanitized.map((s) => s.activityText),
      "activityText"
    );
  } catch {
    // Block the request — PHI detected in free-text field.
    // Do not log the content itself (that would log PHI).
    return Response.json(
      {
        error:
          "Your description appears to contain personal contact information. Please describe only the activity and body sensation.",
      },
      { status: 422 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "API not configured." }, { status: 500 });
  }

  // ── 4. Build the Claude user message — clinical content only ───────────────
  const userMessage = sanitized
    .map(
      (s) =>
        `body_region: ${s.label}\nintensity: ${s.intensity}/10\nsize: ${s.size}\nactivity: ${s.activityText || "Not provided"}`
    )
    .join("\n\n---\n\n");

  // ── 5. Call Claude — non-streaming (JSON response required) ───────────────
  let rawContent: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: CLINICAL_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    rawContent =
      message.content[0]?.type === "text" ? message.content[0].text : "";
  } catch {
    return Response.json(
      { error: "Assessment service unavailable. Please try again." },
      { status: 502 }
    );
  }

  // ── 6. Parse Claude's JSON response ───────────────────────────────────────
  let assessment: unknown;
  try {
    // Claude may wrap JSON in markdown fences — strip them
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    assessment = JSON.parse(cleaned);
  } catch {
    return Response.json(
      { error: "Assessment parsing failed. Please try again." },
      { status: 500 }
    );
  }

  // ── 7. Audit log — user ID + action only, no PHI ──────────────────────────
  const ip = getClientIp(request);
  await logAuditEvent(user.id, "ai_assessment_requested", ip);

  return Response.json(assessment, {
    headers: {
      "Cache-Control": "no-store, no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
