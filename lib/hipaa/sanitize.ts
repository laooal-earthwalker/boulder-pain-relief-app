/**
 * lib/hipaa/sanitize.ts
 *
 * HIPAA minimum-necessary standard — strip any personally identifying
 * information before data is sent to external APIs (Claude, etc.).
 *
 * Only clinical content reaches external services:
 *   ✓  body region label (anatomical term)
 *   ✓  pain intensity (numeric)
 *   ✓  activity description (free text — client-authored, not identifier)
 *   ✓  spot size category
 *
 *   ✗  client name
 *   ✗  email address
 *   ✗  user ID / UUID
 *   ✗  IP address
 *   ✗  any other demographic or identifying field
 */

/** What we allow through to external AI APIs */
export interface SanitizedSpot {
  /** Anatomical region label only — e.g. "Left Shoulder" */
  label: string;
  /** 1–10 numeric scale */
  intensity: number;
  /** Client's free-text description of the triggering activity */
  activityText: string;
  /** Spread category: pinpoint | regional | diffuse */
  size: string;
}

/**
 * Strip PHI from pain spot array before sending to Claude.
 * Drops: regionId, cx, cy, view, and any unexpected keys.
 */
export function sanitizeSpotsForAI(
  spots: Array<{
    label?: string;
    intensity?: number;
    activityText?: string;
    size?: string;
    [key: string]: unknown;
  }>
): SanitizedSpot[] {
  return spots.map((spot) => ({
    label: String(spot.label ?? "Unknown region").slice(0, 80),
    intensity: Number(spot.intensity ?? 5),
    activityText: String(spot.activityText ?? "").slice(0, 600),
    size: String(spot.size ?? "regional"),
  }));
}

/** Regex patterns that suggest PHI is present in a string */
const PHI_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // email
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // US phone
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN
  /\b[A-Z]{1,2}\d{6,9}\b/, // passport-like
];

/**
 * Returns true if the string appears to contain PHI.
 * Use as a pre-flight check before any external API call.
 */
export function containsPHI(text: string): boolean {
  return PHI_PATTERNS.some((re) => re.test(text));
}

/**
 * Guard: throw if any string in the payload contains PHI patterns.
 * Call this before building the Claude request body.
 */
export function assertNoPHI(values: string[], context: string): void {
  for (const v of values) {
    if (containsPHI(v)) {
      throw new Error(
        `PHI detected in ${context} — request blocked before external API call.`
      );
    }
  }
}
