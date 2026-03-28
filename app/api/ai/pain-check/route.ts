import { anthropic } from "@/lib/anthropic";
import { CLINICAL_SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";
import { sanitizeSpotsForAI } from "@/lib/hipaa/sanitize";

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
  // ── 1. Parse and validate input ────────────────────────────────────────────
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "API not configured." }, { status: 500 });
  }

  // ── 2. Sanitize — strip PHI before building the Claude payload ─────────────
  const sanitized = sanitizeSpotsForAI(body.spots);

  // ── 3. Build the Claude user message ──────────────────────────────────────
  const userMessage = sanitized
    .map(
      (s) =>
        `body_region: ${s.label}\nintensity: ${s.intensity}/10\nsize: ${s.size}\nactivity: ${s.activityText || "Not provided"}`
    )
    .join("\n\n---\n\n");

  // ── 4. Call Claude ─────────────────────────────────────────────────────────
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

  // ── 5. Parse Claude's JSON response ───────────────────────────────────────
  let assessment: unknown;
  try {
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

  return Response.json(assessment, {
    headers: {
      "Cache-Control": "no-store, no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
