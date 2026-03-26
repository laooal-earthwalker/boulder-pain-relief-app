/**
 * File-based session store for PainMap longitudinal tracking.
 * Writes to /data/painmap-sessions.json at the project root.
 * Server-side only — never import this from client components.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import type { PainMapSession, SessionStore } from "@/types/painmap";

const DATA_DIR = join(process.cwd(), "data");
const STORE_PATH = join(DATA_DIR, "painmap-sessions.json");

function ensureStore(): SessionStore {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(STORE_PATH)) {
    const empty: SessionStore = { sessions: [] };
    writeFileSync(STORE_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf-8")) as SessionStore;
  } catch {
    return { sessions: [] };
  }
}

function persist(store: SessionStore): void {
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export function getAllSessions(): PainMapSession[] {
  return ensureStore().sessions;
}

export function getSessionsByToken(token: string): PainMapSession[] {
  return ensureStore()
    .sessions.filter((s) => s.clientToken === token)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
}

export function addSession(
  data: Omit<PainMapSession, "id">
): PainMapSession {
  const store = ensureStore();
  const session: PainMapSession = { id: randomUUID(), ...data };
  store.sessions.push(session);
  persist(store);
  return session;
}
