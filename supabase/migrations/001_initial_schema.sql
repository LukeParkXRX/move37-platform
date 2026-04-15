-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM TYPES
CREATE TYPE user_role AS ENUM ('startup', 'enabler', 'org_admin', 'super_admin');
CREATE TYPE enabler_badge AS ENUM ('verified', 'top_rated', 'rising_star');
CREATE TYPE enabler_status AS ENUM ('pending', 'approved', 'suspended');
CREATE TYPE booking_type AS ENUM ('chemistry', 'standard', 'project');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE credit_tx_type AS ENUM ('purchase', 'allocate', 'use', 'hold', 'confirm', 'release', 'refund', 'expire');

-- 2. ORGANIZATIONS (must come before users due to FK)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  program_name TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  total_credits INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. USERS (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'startup',
  avatar_url TEXT,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ENABLER_PROFILES (1:1 with users where role='enabler')
CREATE TABLE enabler_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  university TEXT NOT NULL DEFAULT '',
  degree_type TEXT NOT NULL DEFAULT '',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  credit_rate INT NOT NULL DEFAULT 2,
  enabler_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  badge_level enabler_badge NOT NULL DEFAULT 'verified',
  status enabler_status NOT NULL DEFAULT 'pending',
  session_count INT NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  re_request_rate INT NOT NULL DEFAULT 0,
  availability JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. STARTUP_PROFILES (1:1 with users where role='startup')
CREATE TABLE startup_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL DEFAULT '',
  industry TEXT[] NOT NULL DEFAULT '{}',
  stage TEXT NOT NULL DEFAULT '',
  us_goal TEXT NOT NULL DEFAULT '',
  credit_balance INT NOT NULL DEFAULT 0,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. BOOKINGS
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID NOT NULL REFERENCES users(id),
  enabler_id UUID NOT NULL REFERENCES users(id),
  type booking_type NOT NULL DEFAULT 'standard',
  status booking_status NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ NOT NULL,
  credits_amount INT NOT NULL DEFAULT 0,
  brief TEXT NOT NULL DEFAULT '',
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  meeting_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. CREDIT_TRANSACTIONS (append-only audit log)
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tx_type credit_tx_type NOT NULL,
  amount INT NOT NULL,
  org_id UUID REFERENCES organizations(id),
  startup_id UUID REFERENCES users(id),
  enabler_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  description TEXT NOT NULL DEFAULT '',
  balance_after INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. REVIEWS (1:1 with booking)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id),
  target_id UUID NOT NULL REFERENCES users(id),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. INSIGHTS (blog/articles by enablers)
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. CREDIT_SETTINGS (admin-configurable token costs per session type)
CREATE TABLE credit_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_type booking_type NOT NULL UNIQUE,
  credits_required INT NOT NULL DEFAULT 0,
  label TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

-- 11. CREDIT_EXPIRY_POLICIES (token expiration rules)
CREATE TABLE credit_expiry_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  expiry_days INT NOT NULL DEFAULT 365,
  grace_period_days INT NOT NULL DEFAULT 30,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT one_default_policy UNIQUE (is_default) -- only one default
);

-- ═══════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_enabler_status ON enabler_profiles(status);
CREATE INDEX idx_enabler_specialties ON enabler_profiles USING GIN(specialties);
CREATE INDEX idx_startup_org ON startup_profiles(org_id);
CREATE INDEX idx_startup_industry ON startup_profiles USING GIN(industry);
CREATE INDEX idx_bookings_startup ON bookings(startup_id);
CREATE INDEX idx_bookings_enabler ON bookings(enabler_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_credit_tx_org ON credit_transactions(org_id);
CREATE INDEX idx_credit_tx_startup ON credit_transactions(startup_id);
CREATE INDEX idx_credit_tx_type ON credit_transactions(tx_type);
CREATE INDEX idx_credit_tx_created ON credit_transactions(created_at);
CREATE INDEX idx_reviews_target ON reviews(target_id);
CREATE INDEX idx_insights_author ON insights(author_id);
CREATE INDEX idx_insights_tags ON insights USING GIN(tags);

-- ═══════════════════════════════════════════════════════
-- SEED: Default credit settings
-- ═══════════════════════════════════════════════════════

INSERT INTO credit_settings (session_type, credits_required, label, description) VALUES
  ('chemistry', 0, 'Chemistry Call', '첫 만남 — 무료 15분 세션'),
  ('standard', 2, 'Standard Session', '심화 상담 — 60분 세션'),
  ('project', 5, 'Project Consultation', '프로젝트 단위 — 협의 세션');

INSERT INTO credit_expiry_policies (expiry_days, grace_period_days, is_default) VALUES
  (365, 30, true);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enabler_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_expiry_policies ENABLE ROW LEVEL SECURITY;

-- Users: can read all, update own
CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Enabler profiles: public read, owner update
CREATE POLICY "enabler_select" ON enabler_profiles FOR SELECT USING (true);
CREATE POLICY "enabler_update_own" ON enabler_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "enabler_insert" ON enabler_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Startup profiles: owner read/update, org_admin can read org members
CREATE POLICY "startup_select_own" ON startup_profiles FOR SELECT USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
  OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'org_admin' AND u.org_id = startup_profiles.org_id)
);
CREATE POLICY "startup_update_own" ON startup_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "startup_insert" ON startup_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Organizations: public read
CREATE POLICY "org_select" ON organizations FOR SELECT USING (true);
CREATE POLICY "org_admin_update" ON organizations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'super_admin' OR (role = 'org_admin' AND org_id = organizations.id)))
);

-- Bookings: participants can read, startup can create
CREATE POLICY "booking_select" ON bookings FOR SELECT USING (
  auth.uid() = startup_id
  OR auth.uid() = enabler_id
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'org_admin'))
);
CREATE POLICY "booking_insert" ON bookings FOR INSERT WITH CHECK (auth.uid() = startup_id);
CREATE POLICY "booking_update" ON bookings FOR UPDATE USING (
  auth.uid() = startup_id
  OR auth.uid() = enabler_id
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Credit transactions: read by involved parties, insert by system (via service_role)
CREATE POLICY "credit_tx_select" ON credit_transactions FOR SELECT USING (
  auth.uid() = startup_id
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'org_admin'))
);

-- Reviews: public read, author can create
CREATE POLICY "review_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "review_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Insights: public read, enabler can create
CREATE POLICY "insight_select" ON insights FOR SELECT USING (true);
CREATE POLICY "insight_insert" ON insights FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'enabler')
);

-- Credit settings: public read, admin update
CREATE POLICY "credit_settings_select" ON credit_settings FOR SELECT USING (true);
CREATE POLICY "credit_settings_update" ON credit_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Credit expiry policies: admin only
CREATE POLICY "expiry_select" ON credit_expiry_policies FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'org_admin'))
);
CREATE POLICY "expiry_update" ON credit_expiry_policies FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);
