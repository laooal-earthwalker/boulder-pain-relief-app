import { anthropic } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are a knowledgeable, caring Licensed Massage Therapist (LMT) at Boulder Pain Relief Massage in Boulder, CO. You specialize in evidence-based clinical massage therapy for desk workers, athletes, and the CrossFit community.

A client is describing their pain or discomfort. Respond as their trusted practitioner — direct, warm, and specific to what they've shared. Never generic.

Structure your response using these exact markdown section headers:

## What May Be Happening

Explain in plain language what is likely occurring in their muscles, fascia, or connective tissue based on their specific symptom picture. Name the tissues involved (and briefly explain them), describe the mechanism, and connect it clearly to their reported activities and duration. Be specific — not "you may have muscle tension" but what kind, where, why.

## Self-Care Recommendations

Give exactly 3 numbered, specific, actionable recommendations they can do today or this week. Each should include: what to do, how to do it, and how often. Reference their specific location and activities. Options include: stretches, mobilizations, self-massage techniques, heat/ice protocols, ergonomic adjustments, loading modifications.

## Should You Book a Session?

Give an honest, direct recommendation. If yes, explain what a session would specifically address that self-care cannot. If not urgent, say so but give a threshold ("if X persists after Y weeks, come in"). Mention that Boulder Pain Relief offers sessions via Acuity Scheduling.

---

Guidelines:
- Use plain language. Explain any anatomy term the first time you use it.
- Be specific to their reported location, intensity, duration, and activities — do not give generic advice.
- Do not suggest seeing a doctor unless symptoms suggest something potentially serious (acute trauma, neurological symptoms like numbness/tingling radiating down a limb, or bowel/bladder changes).
- End with one sentence: "This is educational guidance based on what you've shared, not a medical diagnosis."
- Keep the total response under 450 words.`;

interface PainCheckRequest {
  location: string;
  intensity: number;
  duration: string;
  worseWith: string;
  betterWith: string;
}

function buildUserMessage(data: PainCheckRequest): string {
  return `Here is my situation:

**Pain location:** ${data.location}
**Intensity:** ${data.intensity}/10
**How long:** ${data.duration}
**Makes it worse:** ${data.worseWith || "Nothing specific noted"}
**Makes it better:** ${data.betterWith || "Nothing specific noted"}

Please give me your assessment.`;
}

export async function POST(request: Request) {
  let body: PainCheckRequest;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Basic validation
  if (!body.location?.trim()) {
    return Response.json(
      { error: "Please describe your pain location." },
      { status: 422 }
    );
  }
  if (
    typeof body.intensity !== "number" ||
    body.intensity < 1 ||
    body.intensity > 10
  ) {
    return Response.json(
      { error: "Intensity must be between 1 and 10." },
      { status: 422 }
    );
  }
  if (!body.duration) {
    return Response.json(
      { error: "Please select how long you've had this pain." },
      { status: 422 }
    );
  }

  // Enforce reasonable input lengths to control token usage
  body.location = body.location.slice(0, 200);
  body.worseWith = (body.worseWith ?? "").slice(0, 400);
  body.betterWith = (body.betterWith ?? "").slice(0, 400);

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "API key not configured." },
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 700,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildUserMessage(body) }],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unexpected error.";
        controller.enqueue(encoder.encode(`\n\n_Error: ${message}_`));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
