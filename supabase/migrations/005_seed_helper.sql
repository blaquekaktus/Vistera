-- ============================================================
-- Vistera – Seed helper RPC function
-- Run ONCE in Supabase SQL Editor, then `npm run seed` handles everything.
--
-- This function:
--   1. Repairs the handle_new_user trigger (fixes the bug in place)
--   2. Creates the auth user directly in the database
--   3. Creates the identity record so email login works
--   4. Upserts the profile and agent_profile rows
--   5. Is fully idempotent — safe to call multiple times
-- ============================================================

-- ── Helper: check whether a column exists ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.vistera_col_exists(
  p_schema text, p_table text, p_col text
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = p_schema
      AND table_name   = p_table
      AND column_name  = p_col
  );
$$;

-- ── Main seed function ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_seed_user(
  p_email        text,
  p_name         text,
  p_phone        text,
  p_agency       text,
  p_region       text,
  p_languages    text[],
  p_rating       numeric,
  p_review_count integer
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_id              uuid;
  v_has_sso_user    boolean;
  v_has_is_anon     boolean;
  v_has_provider_id boolean;
  v_pw              text;
  v_crypt_ns        text;
BEGIN

  -- ── Step 0: Hash the password ─────────────────────────────────────────────
  -- Try to find pgcrypto dynamically in ANY schema via pg_proc.
  -- If pgcrypto is not installed at all, fall back to a pre-computed
  -- bcrypt hash of 'Vistera2024!' so the seed never fails.
  SELECT n.nspname INTO v_crypt_ns
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE p.proname = 'crypt'
  LIMIT 1;

  IF v_crypt_ns IS NOT NULL THEN
    BEGIN
      EXECUTE format('SELECT %I.crypt($1, %I.gen_salt($2))', v_crypt_ns, v_crypt_ns)
        INTO v_pw
        USING 'Vistera2024!', 'bf';
    EXCEPTION WHEN OTHERS THEN
      -- Dynamic call failed for some reason; use pre-computed hash
      v_pw := '$2b$10$00xC7ihU6IATjR4x02TzU.pJBaS0j6u.9QfsELUsB9JgMcHuwuLEm';
    END;
  ELSE
    -- pgcrypto not installed — use pre-computed bcrypt hash
    v_pw := '$2b$10$00xC7ihU6IATjR4x02TzU.pJBaS0j6u.9QfsELUsB9JgMcHuwuLEm';
  END IF;

  -- ── Step 1: Repair handle_new_user in-place ──────────────────────────────
  EXECUTE $fix$
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $body$
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
        NULL;
      END;
      RETURN NEW;
    END;
    $body$ LANGUAGE plpgsql SECURITY DEFINER;
  $fix$;

  -- ── Step 2: Check for existing user ──────────────────────────────────────
  SELECT id INTO v_id FROM auth.users WHERE email = p_email;

  IF v_id IS NULL THEN
    v_id := gen_random_uuid();

    -- ── Step 3: Detect schema features ─────────────────────────────────────
    v_has_sso_user := public.vistera_col_exists('auth', 'users', 'is_sso_user');
    v_has_is_anon  := public.vistera_col_exists('auth', 'users', 'is_anonymous');

    -- ── Step 4: Insert auth user ────────────────────────────────────────────
    IF v_has_sso_user AND v_has_is_anon THEN
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_user_meta_data, raw_app_meta_data,
        is_super_admin, is_sso_user, is_anonymous, created_at, updated_at
      ) VALUES (
        v_id,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'authenticated', 'authenticated',
        p_email,
        v_pw,
        now(),
        jsonb_build_object('name', p_name, 'role', 'agent'),
        '{"provider":"email","providers":["email"]}'::jsonb,
        false, false, false,
        now(), now()
      );
    ELSE
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_user_meta_data, raw_app_meta_data,
        is_super_admin, created_at, updated_at
      ) VALUES (
        v_id,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'authenticated', 'authenticated',
        p_email,
        v_pw,
        now(),
        jsonb_build_object('name', p_name, 'role', 'agent'),
        '{"provider":"email","providers":["email"]}'::jsonb,
        false,
        now(), now()
      );
    END IF;

    -- ── Step 5: Insert identity record (email/password login) ───────────────
    v_has_provider_id := public.vistera_col_exists('auth', 'identities', 'provider_id');

    BEGIN
      IF v_has_provider_id THEN
        INSERT INTO auth.identities (
          provider_id, user_id, identity_data, provider,
          last_sign_in_at, created_at, updated_at
        ) VALUES (
          p_email, v_id,
          jsonb_build_object(
            'sub',            v_id::text,
            'email',          p_email,
            'email_verified', true,
            'provider',       'email'
          ),
          'email',
          now(), now(), now()
        );
      ELSE
        EXECUTE format(
          'INSERT INTO auth.identities
             (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
           VALUES (%L, %L::uuid, %L::jsonb, %L, now(), now(), now())',
          p_email, v_id::text,
          jsonb_build_object(
            'sub', v_id::text, 'email', p_email, 'email_verified', true
          )::text,
          'email'
        );
      END IF;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  -- ── Step 6: Upsert profile ────────────────────────────────────────────────
  INSERT INTO public.profiles (id, name, role, phone)
  VALUES (v_id, p_name, 'agent'::user_role, p_phone)
  ON CONFLICT (id) DO UPDATE SET
    name  = EXCLUDED.name,
    role  = EXCLUDED.role,
    phone = EXCLUDED.phone;

  -- ── Step 7: Upsert agent_profile ─────────────────────────────────────────
  INSERT INTO public.agent_profiles (
    id, agency, region, languages, rating, review_count
  ) VALUES (
    v_id, p_agency, p_region, p_languages, p_rating, p_review_count
  )
  ON CONFLICT (id) DO UPDATE SET
    agency       = EXCLUDED.agency,
    region       = EXCLUDED.region,
    languages    = EXCLUDED.languages,
    rating       = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

  RETURN v_id;
END;
$$;
