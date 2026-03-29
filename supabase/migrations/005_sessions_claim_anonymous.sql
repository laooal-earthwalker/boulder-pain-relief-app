-- ============================================================
-- Allow authenticated users to claim their anonymous sessions.
--
-- claimAnonymousSessions() in lib/painmap-client.ts issues an
-- UPDATE setting client_id = auth.uid() on rows where
-- client_token matches the device token and client_id IS NULL.
-- Without this policy the UPDATE runs but affects 0 rows
-- (RLS silently blocks it with no error).
-- ============================================================

CREATE POLICY "sessions: claim anonymous"
  ON pain_sessions FOR UPDATE
  USING  (client_token IS NOT NULL AND client_id IS NULL)
  WITH CHECK (client_id = auth.uid());
