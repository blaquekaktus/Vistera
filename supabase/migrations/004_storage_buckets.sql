-- ============================================================
-- Vistera – Storage Buckets & RLS Policies
-- Run in Supabase SQL Editor or via: supabase db push
-- Fully idempotent: safe to run multiple times
-- ============================================================

-- ── Buckets ─────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('property-images', 'property-images', true, 10485760,  ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('panoramas',       'panoramas',       true, 52428800,  ARRAY['image/jpeg','image/png','image/webp']),
  ('avatars',         'avatars',         true, 5242880,   ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ── RLS policies ─────────────────────────────────────────────
-- Public read for all three buckets
DROP POLICY IF EXISTS "Public read – property-images" ON storage.objects;
CREATE POLICY "Public read – property-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Public read – panoramas" ON storage.objects;
CREATE POLICY "Public read – panoramas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'panoramas');

DROP POLICY IF EXISTS "Public read – avatars" ON storage.objects;
CREATE POLICY "Public read – avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated upload: path must start with the user's UID
DROP POLICY IF EXISTS "Auth upload – property-images" ON storage.objects;
CREATE POLICY "Auth upload – property-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Auth upload – panoramas" ON storage.objects;
CREATE POLICY "Auth upload – panoramas"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'panoramas'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Auth upload – avatars" ON storage.objects;
CREATE POLICY "Auth upload – avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated update/replace own files
DROP POLICY IF EXISTS "Auth update – property-images" ON storage.objects;
CREATE POLICY "Auth update – property-images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Auth update – panoramas" ON storage.objects;
CREATE POLICY "Auth update – panoramas"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'panoramas'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Auth update – avatars" ON storage.objects;
CREATE POLICY "Auth update – avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated delete own files
DROP POLICY IF EXISTS "Auth delete – property-images" ON storage.objects;
CREATE POLICY "Auth delete – property-images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Auth delete – panoramas" ON storage.objects;
CREATE POLICY "Auth delete – panoramas"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'panoramas'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Auth delete – avatars" ON storage.objects;
CREATE POLICY "Auth delete – avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
