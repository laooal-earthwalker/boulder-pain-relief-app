-- ============================================================
-- PainMap schema — run in the Supabase SQL editor
-- ============================================================

-- ── 1. profiles ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'client'
               CHECK (role IN ('client', 'practitioner')),
  full_name  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-create a profile row whenever a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 2. pain_sessions ─────────────────────────────────────────
-- client_id is null for anonymous sessions; client_token is used instead.
CREATE TABLE IF NOT EXISTS pain_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_token text,                  -- anonymous session identifier
  created_at   timestamptz NOT NULL DEFAULT now(),
  duration     text NOT NULL,
  notes        text,
  worse_with   text,
  better_with  text,
  figure       text NOT NULL DEFAULT 'male'
                 CHECK (figure IN ('male', 'female')),
  CONSTRAINT has_owner CHECK (
    client_id IS NOT NULL OR client_token IS NOT NULL
  )
);

-- ── 3. pain_spots ────────────────────────────────────────────
-- view uses 'front'/'back' to match the app's internal convention.
CREATE TABLE IF NOT EXISTS pain_spots (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES pain_sessions(id) ON DELETE CASCADE,
  x            float NOT NULL,
  y            float NOT NULL,
  intensity    int  NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  spread       text NOT NULL CHECK (spread IN ('pinpoint', 'regional', 'diffuse')),
  region_id    text,
  region_label text NOT NULL,
  view         text NOT NULL CHECK (view IN ('front', 'back')),
  figure       text NOT NULL CHECK (figure IN ('male', 'female'))
);

-- ── Row-Level Security ────────────────────────────────────────
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_spots    ENABLE ROW LEVEL SECURITY;

-- profiles: users read/update their own row; practitioners read all
CREATE POLICY "profiles: own row"
  ON profiles FOR ALL
  USING (id = auth.uid());

CREATE POLICY "profiles: practitioners read all"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

-- pain_sessions: authenticated clients own their sessions
CREATE POLICY "sessions: client owns"
  ON pain_sessions FOR ALL
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- pain_sessions: anonymous can insert (client_id must be null)
CREATE POLICY "sessions: anon insert"
  ON pain_sessions FOR INSERT
  WITH CHECK (client_id IS NULL AND client_token IS NOT NULL);

-- pain_sessions: practitioners read all
CREATE POLICY "sessions: practitioners read all"
  ON pain_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

-- pain_spots: inherit access via parent session
CREATE POLICY "spots: via owned session"
  ON pain_spots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pain_sessions s
      WHERE s.id = session_id
        AND (s.client_id = auth.uid() OR auth.uid() IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pain_sessions s
      WHERE s.id = session_id
        AND (s.client_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

-- pain_spots: practitioners read all
CREATE POLICY "spots: practitioners read all"
  ON pain_spots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS pain_sessions_client_id    ON pain_sessions (client_id);
CREATE INDEX IF NOT EXISTS pain_sessions_client_token ON pain_sessions (client_token);
CREATE INDEX IF NOT EXISTS pain_spots_session_id      ON pain_spots    (session_id);
