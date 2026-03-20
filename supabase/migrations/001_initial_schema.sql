-- ============================================================
-- Vistera – Initial Database Schema
-- Run this in your Supabase SQL Editor (or via supabase db push)
-- Fully idempotent: safe to run multiple times
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enums ───────────────────────────────────────────────────
-- CREATE TYPE has no IF NOT EXISTS; use exception blocks instead
DO $$ BEGIN CREATE TYPE user_role       AS ENUM ('buyer', 'seller', 'agent', 'admin');        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE property_type   AS ENUM ('apartment', 'house', 'villa', 'chalet', 'penthouse', 'commercial'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE listing_type    AS ENUM ('sale', 'rent');                              EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE property_status AS ENUM ('active', 'reserved', 'sold', 'rented');     EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE currency_code   AS ENUM ('EUR', 'CHF');                               EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE country_code    AS ENUM ('AT', 'DE', 'CH');                           EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE inquiry_type    AS ENUM ('inquiry', 'viewing', 'vr_tour');            EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE inquiry_status  AS ENUM ('new', 'read', 'responded', 'closed');       EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE agent_plan      AS ENUM ('starter', 'professional', 'enterprise');    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Profiles ────────────────────────────────────────────────
-- Extends auth.users — created automatically on sign-up via trigger
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name        TEXT        NOT NULL,
  role        user_role   NOT NULL DEFAULT 'buyer',
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Agent Profiles ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.agent_profiles (
  id              UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  agency          TEXT        NOT NULL,
  region          TEXT,
  languages       TEXT[]      NOT NULL DEFAULT '{}',
  bio             TEXT,
  rating          DECIMAL(3,2) NOT NULL DEFAULT 0,
  review_count    INT          NOT NULL DEFAULT 0,
  verified        BOOLEAN      NOT NULL DEFAULT FALSE,
  plan            agent_plan   NOT NULL DEFAULT 'starter',
  plan_expires_at TIMESTAMPTZ
);

-- ── Properties ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.properties (
  id            UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id      UUID         NOT NULL REFERENCES public.profiles(id),
  -- Titles & descriptions (DE primary, EN secondary)
  title         TEXT         NOT NULL,
  title_de      TEXT,
  description   TEXT,
  description_de TEXT,
  -- Classification
  type          property_type   NOT NULL,
  listing_type  listing_type    NOT NULL,
  -- Pricing
  price         DECIMAL(12,2)   NOT NULL,
  currency      currency_code   NOT NULL DEFAULT 'EUR',
  price_per_sqm DECIMAL(10,2),
  -- Location
  street        TEXT,
  city          TEXT         NOT NULL,
  region        TEXT,
  country       country_code NOT NULL,
  postal_code   TEXT,
  lat           DECIMAL(10,7),
  lng           DECIMAL(10,7),
  -- Features
  rooms         SMALLINT,
  bedrooms      SMALLINT,
  bathrooms     SMALLINT,
  area          DECIMAL(10,2) NOT NULL,
  plot_area     DECIMAL(10,2),
  floor         SMALLINT,
  total_floors  SMALLINT,
  year_built    SMALLINT,
  parking       BOOLEAN NOT NULL DEFAULT FALSE,
  elevator      BOOLEAN NOT NULL DEFAULT FALSE,
  balcony       BOOLEAN NOT NULL DEFAULT FALSE,
  garden        BOOLEAN NOT NULL DEFAULT FALSE,
  cellar        BOOLEAN NOT NULL DEFAULT FALSE,
  energy_class  TEXT,
  -- Content
  amenities     TEXT[] NOT NULL DEFAULT '{}',
  images        TEXT[] NOT NULL DEFAULT '{}',
  -- Metadata
  status        property_status NOT NULL DEFAULT 'active',
  featured      BOOLEAN         NOT NULL DEFAULT FALSE,
  views         INT             NOT NULL DEFAULT 0,
  vr_views      INT             NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── VR Tours ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vr_tours (
  id            UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id   UUID        NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  panorama_url  TEXT        NOT NULL,
  thumbnail_url TEXT,
  room_name     TEXT,
  room_name_de  TEXT,
  sort_order    SMALLINT    NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Inquiries ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inquiries (
  id          UUID           NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID           NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  agent_id    UUID           NOT NULL REFERENCES public.profiles(id),
  -- Sender (not necessarily a registered user)
  name        TEXT           NOT NULL,
  email       TEXT           NOT NULL,
  phone       TEXT,
  message     TEXT,
  type        inquiry_type   NOT NULL DEFAULT 'inquiry',
  status      inquiry_status NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_properties_agent    ON public.properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_country  ON public.properties(country);
CREATE INDEX IF NOT EXISTS idx_properties_type     ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status   ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_vr_tours_property   ON public.vr_tours(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_agent     ON public.inquiries(agent_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property  ON public.inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status    ON public.inquiries(status);

-- ── updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_properties_updated_at ON public.properties;
CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Auto-create profile on sign-up ───────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role;
BEGIN
  BEGIN
    v_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'buyer'::user_role
    );

    INSERT INTO public.profiles (id, name, role, avatar_url)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      v_role,
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    IF v_role = 'agent'::user_role THEN
      INSERT INTO public.agent_profiles (id, agency)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'agency', 'Mein Maklerbüro')
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Never block user creation due to profile trigger errors
    NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vr_tours      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries     ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- agent_profiles
DROP POLICY IF EXISTS "Agent profiles viewable by everyone" ON public.agent_profiles;
CREATE POLICY "Agent profiles viewable by everyone"
  ON public.agent_profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Agents can update own agent profile" ON public.agent_profiles;
CREATE POLICY "Agents can update own agent profile"
  ON public.agent_profiles FOR UPDATE USING (auth.uid() = id);

-- properties: public read for active; agent owns their listings
DROP POLICY IF EXISTS "Active properties are public" ON public.properties;
CREATE POLICY "Active properties are public"
  ON public.properties FOR SELECT
  USING (status = 'active' OR agent_id = auth.uid());

DROP POLICY IF EXISTS "Agents can insert own properties" ON public.properties;
CREATE POLICY "Agents can insert own properties"
  ON public.properties FOR INSERT
  WITH CHECK (agent_id = auth.uid());

DROP POLICY IF EXISTS "Agents can update own properties" ON public.properties;
CREATE POLICY "Agents can update own properties"
  ON public.properties FOR UPDATE
  USING (agent_id = auth.uid());

DROP POLICY IF EXISTS "Agents can delete own properties" ON public.properties;
CREATE POLICY "Agents can delete own properties"
  ON public.properties FOR DELETE
  USING (agent_id = auth.uid());

-- vr_tours: same visibility as parent property
DROP POLICY IF EXISTS "VR tours viewable with parent property" ON public.vr_tours;
CREATE POLICY "VR tours viewable with parent property"
  ON public.vr_tours FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = vr_tours.property_id
        AND (p.status = 'active' OR p.agent_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Agents manage their own VR tours" ON public.vr_tours;
CREATE POLICY "Agents manage their own VR tours"
  ON public.vr_tours FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = vr_tours.property_id AND p.agent_id = auth.uid()
    )
  );

-- inquiries: agent sees their own; anyone can submit
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiries"
  ON public.inquiries FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Agents see inquiries for their properties" ON public.inquiries;
CREATE POLICY "Agents see inquiries for their properties"
  ON public.inquiries FOR SELECT
  USING (agent_id = auth.uid());

DROP POLICY IF EXISTS "Agents update inquiry status" ON public.inquiries;
CREATE POLICY "Agents update inquiry status"
  ON public.inquiries FOR UPDATE
  USING (agent_id = auth.uid());

-- ── Storage Buckets ─────────────────────────────────────────
-- Run these separately in the Supabase Storage UI or via CLI:
--
-- supabase storage create panoramas --public
-- supabase storage create property-images --public
--
-- Or uncomment and run:
-- INSERT INTO storage.buckets (id, name, public)
--   VALUES ('panoramas', 'panoramas', TRUE),
--          ('property-images', 'property-images', TRUE)
--   ON CONFLICT DO NOTHING;
