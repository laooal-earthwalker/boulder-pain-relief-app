/**
 * Client-side PainMap session storage.
 * All data lives in localStorage under "painmap-sessions".
 * Safe to import from client components — no server APIs used.
 */

import type { PainMapSession } from "@/types/painmap";

const SESSIONS_KEY = "painmap-sessions";

export function getSessions(): PainMapSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as PainMapSession[]) : [];
  } catch {
    return [];
  }
}

export function addSession(data: Omit<PainMapSession, "id">): PainMapSession {
  const sessions = getSessions();
  const session: PainMapSession = { id: crypto.randomUUID(), ...data };
  sessions.push(session);
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // Storage quota exceeded — still return the session object
  }
  return session;
}

export {
  buildComparison,
  computeInsights,
  computeRegionFrequencies,
} from "./painmap-insights";
