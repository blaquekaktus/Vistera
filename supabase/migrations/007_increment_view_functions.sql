-- Atomic increment functions for view counters
-- Using SECURITY DEFINER so anonymous users can bump counts without needing
-- an explicit UPDATE policy on the properties table.

CREATE OR REPLACE FUNCTION increment_vr_views(p_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE properties SET vr_views = vr_views + 1 WHERE id = p_id;
$$;

CREATE OR REPLACE FUNCTION increment_views(p_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE properties SET views = views + 1 WHERE id = p_id;
$$;

GRANT EXECUTE ON FUNCTION increment_vr_views TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_views    TO anon, authenticated;
