-- ═══════════════════════════════════════════════════════
-- Migration 007: Test Data Flag
-- ═══════════════════════════════════════════════════════
-- Adds is_test flag to users and organizations so that
-- seed/test data can coexist with real data safely.
--
-- Public listings filter is_test = false by default.
-- Test mode is entered via:
--   (a) env NEXT_PUBLIC_SHOW_TEST_DATA=true (local dev)
--   (b) authenticated super_admin user (auto)
-- ═══════════════════════════════════════════════════════

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT false;

-- Partial index: only rows where is_test=true are indexed.
-- Cheap for real data (majority false), fast for seed operations.
CREATE INDEX IF NOT EXISTS idx_users_is_test
  ON users(is_test) WHERE is_test = true;

CREATE INDEX IF NOT EXISTS idx_orgs_is_test
  ON organizations(is_test) WHERE is_test = true;

-- No RLS policy change — filtering happens at application layer
-- (server query adds .eq('users.is_test', false) unless test mode).
-- Rationale: RLS-based filtering would require JWT claim or cookie
-- inspection, which complicates local development and admin views.
