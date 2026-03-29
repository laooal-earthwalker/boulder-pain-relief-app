/**
 * Client-side PainMap session storage.
 *
 * Write path  → Supabase first, localStorage mirror on success,
 *               localStorage only on Supabase error/unavailable.
 * Read path   → Supabase first (authenticated or by token),
 *               falls back to localStorage.
 *
 * Safe to import from client components — no server APIs used.
 */

import type { PainMapSession, PainMapSpot } from "@/types/painmap";
import { getSupabase } from "./supabase-browser";

const SESSIONS_KEY = "painmap-sessions";

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsGet(): PainMapSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as PainMapSession[]) : [];
  } catch {
    return [];
  }
}

function lsSet(sessions: PainMapSession[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // Storage quota — best-effort
  }
}

function lsAdd(session: PainMapSession): void {
  const sessions = lsGet();
  sessions.push(session);
  lsSet(sessions);
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

/** Returns the authenticated user's id, or null for anonymous visitors. */
async function getAuthUserId(): Promise<string | null> {
  try {
    const { data } = await getSupabase().auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Write a full session + its spots to Supabase.
 * Returns true on success, false on any error.
 */
async function sbWrite(session: PainMapSession): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const userId = await getAuthUserId();

    // Insert session row
    const { error: sessionErr } = await supabase
      .from("pain_sessions")
      .insert({
        id:           session.id,
        client_id:    userId,
        client_token: userId ? null : session.clientToken,
        created_at:   session.timestamp,
        duration:     session.duration,
        notes:        null,
        worse_with:   session.worseWith ?? null,
        better_with:  session.betterWith ?? null,
        figure:       session.figure,
      });

    if (sessionErr) {
      console.warn("[painmap] Supabase session insert failed:", sessionErr.message);
      return false;
    }

    // Insert spots
    if (session.spots.length > 0) {
      const spotRows = session.spots.map((s: PainMapSpot) => ({
        session_id:   session.id,
        x:            s.cx,
        y:            s.cy,
        intensity:    s.intensity,
        spread:       s.size,
        region_id:    s.regionId,
        region_label: s.label,
        view:         s.view,
        figure:       session.figure,
      }));

      const { error: spotsErr } = await supabase
        .from("pain_spots")
        .insert(spotRows);

      if (spotsErr) {
        console.warn("[painmap] Supabase spots insert failed:", spotsErr.message);
        // Session header saved; spot failure is non-fatal locally but we
        // return false so the caller can decide whether to trust Supabase.
        return false;
      }
    }

    return true;
  } catch (err) {
    console.warn("[painmap] Supabase write error:", err);
    return false;
  }
}

/**
 * Read sessions from Supabase, mapped back to PainMapSession shape.
 * Returns null if unavailable (caller should fall back to localStorage).
 */
async function sbRead(): Promise<PainMapSession[] | null> {
  try {
    const supabase = getSupabase();
    const userId = await getAuthUserId();

    // Build query — use clientToken stored in localStorage as fallback filter
    let query = supabase
      .from("pain_sessions")
      .select(`*, pain_spots(*)`)
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("client_id", userId);
    } else {
      // Collect tokens from local sessions so anonymous data is still visible
      const localSessions = lsGet();
      const tokens = [...new Set(localSessions.map((s) => s.clientToken).filter(Boolean))];
      if (tokens.length === 0) return null;
      query = query.in("client_token", tokens);
    }

    const { data, error } = await query;
    if (error || !data) return null;

    return data.map((row: SupabaseSessionRow) => ({
      id:          row.id,
      clientToken: row.client_token ?? "",
      timestamp:   row.created_at,
      duration:    row.duration,
      worseWith:   row.worse_with ?? undefined,
      betterWith:  row.better_with ?? undefined,
      figure:      row.figure as "male" | "female",
      spots:       (row.pain_spots ?? []).map((sp: SupabaseSpotRow) => ({
        regionId:  sp.region_id ?? "",
        label:     sp.region_label,
        cx:        sp.x,
        cy:        sp.y,
        intensity: sp.intensity,
        size:      sp.spread as PainMapSpot["size"],
        view:      sp.view as "front" | "back",
      })),
    }));
  } catch {
    return null;
  }
}

// ── Minimal Supabase row types ────────────────────────────────────────────────

interface SupabaseSpotRow {
  region_id:    string | null;
  region_label: string;
  x:            number;
  y:            number;
  intensity:    number;
  spread:       string;
  view:         string;
}

interface SupabaseSessionRow {
  id:           string;
  client_token: string | null;
  created_at:   string;
  duration:     string;
  worse_with:   string | null;
  better_with:  string | null;
  figure:       string;
  pain_spots:   SupabaseSpotRow[];
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns sessions — Supabase first, localStorage fallback.
 */
export async function getSessions(): Promise<PainMapSession[]> {
  const remote = await sbRead();
  if (remote !== null) return remote;
  return lsGet();
}

/**
 * Saves a new session — Supabase first, localStorage always written
 * as a local mirror/fallback.
 */
export async function addSession(
  data: Omit<PainMapSession, "id">
): Promise<PainMapSession> {
  const session: PainMapSession = { id: crypto.randomUUID(), ...data };

  // Always persist locally first so the UI is never blocked
  lsAdd(session);

  // Best-effort remote write (fire and forget — don't await in hot path)
  sbWrite(session).then((ok) => {
    if (!ok) {
      console.warn("[painmap] Falling back to localStorage only for session", session.id);
    }
  });

  return session;
}

/**
 * Claims anonymous sessions on the current device by linking them to the
 * authenticated user. Call this immediately after sign-in or sign-up confirmation.
 *
 * Finds all pain_sessions rows where client_token matches this device's stored
 * token AND client_id IS NULL, then sets client_id to the user's uid.
 */
export async function claimAnonymousSessions(): Promise<void> {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("painmap_token");
  if (!token) return;

  const supabase = getSupabase();
  const userId = await getAuthUserId();
  if (!userId) return;

  const { error } = await supabase
    .from("pain_sessions")
    .update({ client_id: userId, client_token: null })
    .eq("client_token", token)
    .is("client_id", null);

  if (error) {
    console.warn("[painmap] Failed to claim anonymous sessions:", error.message);
  }
}

export {
  buildComparison,
  computeInsights,
  computeRegionFrequencies,
} from "./painmap-insights";
