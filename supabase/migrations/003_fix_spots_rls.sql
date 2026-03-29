-- ============================================================
-- Fix pain_spots RLS: split FOR ALL into explicit per-operation
-- policies so anonymous and authenticated inserts are unambiguous.
--
-- The original "spots: via owned session" FOR ALL policy's WITH CHECK
-- was not reliably permitting inserts for authenticated users.
-- ============================================================

-- ── Drop existing catch-all policy ───────────────────────────
DROP POLICY IF EXISTS "spots: via owned session" ON pain_spots;

-- ── SELECT: own spots via owned session ──────────────────────
CREATE POLICY "spots: select via owned session"
  ON pain_spots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pain_sessions s
      WHERE s.id = session_id
        AND (s.client_id = auth.uid() OR s.client_id IS NULL)
    )
  );

-- ── INSERT: authenticated users may insert spots for their sessions ──
CREATE POLICY "spots: insert authenticated"
  ON pain_spots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pain_sessions s
      WHERE s.id = session_id
        AND s.client_id = auth.uid()
    )
  );

-- ── INSERT: anonymous users may insert spots for token-based sessions ──
CREATE POLICY "spots: insert anonymous"
  ON pain_spots FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL
    AND EXISTS (
      SELECT 1 FROM pain_sessions s
      WHERE s.id = session_id
        AND s.client_id IS NULL
        AND s.client_token IS NOT NULL
    )
  );

-- ── DELETE: users may delete spots belonging to their sessions ──
CREATE POLICY "spots: delete via owned session"
  ON pain_spots FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pain_sessions s
      WHERE s.id = session_id
        AND s.client_id = auth.uid()
    )
  );
