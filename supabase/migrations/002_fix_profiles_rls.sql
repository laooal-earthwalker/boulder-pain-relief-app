-- ============================================================
-- Fix infinite recursion in profiles RLS policies
--
-- The original "profiles: practitioners read all" policy used
-- a subquery against the profiles table from within a profiles
-- policy, causing infinite recursion. Replaced with a check
-- against auth.jwt() app_metadata to avoid self-reference.
-- ============================================================

-- ── Drop recursive policies ───────────────────────────────────
DROP POLICY IF EXISTS "profiles: own row"               ON profiles;
DROP POLICY IF EXISTS "profiles: practitioners read all" ON profiles;

-- ── Safe replacements ─────────────────────────────────────────

-- Users can SELECT their own profile row
CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Users can INSERT their own profile row
CREATE POLICY "profiles: insert own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Users can UPDATE their own profile row
CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Practitioners can read all profiles — role read from app_metadata
-- to avoid querying the profiles table from within its own policy.
-- Set via Supabase dashboard: Authentication → Users → Raw app_metadata → {"role": "practitioner"}
CREATE POLICY "profiles: practitioners read all"
  ON profiles FOR SELECT
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'practitioner'
  );
