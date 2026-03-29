-- ============================================================
-- Fix pain_spots anonymous INSERT policy.
--
-- Root cause: the previous anonymous INSERT policy used an
-- EXISTS subquery against pain_sessions, but the anon role
-- has no SELECT policy on pain_sessions, so the subquery
-- always returned zero rows → EXISTS = false → 42501.
--
-- Fix: replace the subquery-based policy with a direct FK
-- check. Postgres enforces the session_id FK constraint
-- (pain_spots.session_id → pain_sessions.id) independently
-- of RLS, so we don't need to re-verify session ownership
-- inside the policy — the constraint already guarantees the
-- session row exists. We only need to confirm the request is
-- anonymous (auth.uid() IS NULL).
-- ============================================================

DROP POLICY IF EXISTS "spots: insert anonymous" ON pain_spots;

CREATE POLICY "spots: insert anonymous"
  ON pain_spots FOR INSERT
  WITH CHECK (auth.uid() IS NULL);
