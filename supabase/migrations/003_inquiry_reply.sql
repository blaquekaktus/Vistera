-- ============================================================
-- Vistera – Add reply_message to inquiries
-- Run AFTER 001_initial_schema.sql
-- ============================================================

ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS reply_message TEXT;
