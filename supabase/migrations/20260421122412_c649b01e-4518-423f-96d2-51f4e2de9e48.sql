ALTER TABLE public.clips
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS social_network text,
  ADD COLUMN IF NOT EXISTS social_handle text,
  ADD COLUMN IF NOT EXISTS description text;