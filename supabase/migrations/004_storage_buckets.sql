-- ============================================================
-- Vistera – Storage Buckets & RLS Policies
-- Run in Supabase SQL Editor or via: supabase db push
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
CREATE POLICY "Public read – property-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Public read – panoramas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'panoramas');

CREATE POLICY "Public read – avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated upload: path must start with the user's UID
CREATE POLICY "Auth upload – property-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Auth upload – panoramas"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'panoramas'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Auth upload – avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated update/replace own files
CREATE POLICY "Auth update – property-images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Auth update – panoramas"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'panoramas'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Auth update – avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated delete own files
CREATE POLICY "Auth delete – property-images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Auth delete – panoramas"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'panoramas'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Auth delete – avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
