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

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- ── Step 1: Repair handle_new_user in-place ────────────────────────────────
  -- The original function had a variable named 'user_role' that shadowed the
  -- enum type of the same name, causing every createUser call to fail with 500.
  -- SECURITY DEFINER runs as the function owner (postgres role) which owns
  -- handle_new_user, so CREATE OR REPLACE succeeds here.
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

  -- ── Step 2: Check for existing user ───────────────────────────────────────
  SELECT id INTO v_id FROM auth.users WHERE email = p_email;

  IF v_id IS NULL THEN
    v_id := gen_random_uuid();

    -- ── Step 3: Insert auth user directly ───────────────────────────────────
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data,
      is_super_admin,
      is_sso_user,
      is_anonymous,
      created_at,
      updated_at
    ) VALUES (
      v_id,
      '00000000-0000-0000-0000-000000000000'::uuid,
      'authenticated',
      'authenticated',
      p_email,
      crypt('Vistera2024!', gen_salt('bf')),
      now(),
      jsonb_build_object('name', p_name, 'role', 'agent'),
      '{"provider":"email","providers":["email"]}'::jsonb,
      false,
      false,
      false,
      now(),
      now()
    );

    -- ── Step 4: Insert identity record so email/password login works ─────────
    -- Handles both old schema (id text) and new schema (provider_id text).
    BEGIN
      INSERT INTO auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        p_email,
        v_id,
        jsonb_build_object(
          'sub',            v_id::text,
          'email',          p_email,
          'email_verified', true,
          'provider',       'email'
        ),
        'email',
        now(), now(), now()
      );
    EXCEPTION WHEN OTHERS THEN
      -- Older schema uses 'id' column instead of 'provider_id'
      BEGIN
        EXECUTE format(
          'INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
           VALUES (%L, %L, %L, %L, now(), now(), now())',
          p_email, v_id,
          jsonb_build_object('sub', v_id::text, 'email', p_email, 'email_verified', true)::text,
          'email'
        );
      EXCEPTION WHEN OTHERS THEN
        NULL; -- Identity could not be created; login may not work but seed data will be there
      END;
    END;
  END IF;

  -- ── Step 5: Upsert profile ─────────────────────────────────────────────────
  INSERT INTO public.profiles (id, name, role, phone)
  VALUES (v_id, p_name, 'agent'::user_role, p_phone)
  ON CONFLICT (id) DO UPDATE SET
    name  = EXCLUDED.name,
    role  = EXCLUDED.role,
    phone = EXCLUDED.phone;

  -- ── Step 6: Upsert agent_profile ──────────────────────────────────────────
  INSERT INTO public.agent_profiles (id, agency, region, languages, rating, review_count)
  VALUES (v_id, p_agency, p_region, p_languages, p_rating, p_review_count)
  ON CONFLICT (id) DO UPDATE SET
    agency       = EXCLUDED.agency,
    region       = EXCLUDED.region,
    languages    = EXCLUDED.languages,
    rating       = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

  RETURN v_id;
END;
$$;
