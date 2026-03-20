-- ============================================================
-- Vistera – Fix handle_new_user trigger
--
-- Problem: The trigger function lacked SET search_path = public,
-- which causes Supabase's SECURITY DEFINER context to fail to
-- resolve the `user_role` enum type, resulting in the
-- "Database error saving new user" error on sign-up.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role_text TEXT;
  v_role      public.user_role := 'buyer';
  v_name      TEXT;
BEGIN
  BEGIN
    -- Safely extract and validate role without a risky enum cast
    v_role_text := NEW.raw_user_meta_data->>'role';
    IF v_role_text IN ('buyer', 'seller', 'agent', 'admin') THEN
      v_role := v_role_text::public.user_role;
    END IF;

    v_name := COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      split_part(NEW.email, '@', 1)
    );

    INSERT INTO public.profiles (id, name, role, avatar_url)
    VALUES (
      NEW.id,
      v_name,
      v_role,
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    IF v_role = 'agent'::public.user_role THEN
      INSERT INTO public.agent_profiles (id, agency)
      VALUES (
        NEW.id,
        COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'agency'), ''), 'Mein Maklerbüro')
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Never block user creation due to profile trigger errors
    NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- Re-attach trigger to ensure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
