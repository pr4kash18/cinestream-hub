-- Add per-quality video URLs to movies
ALTER TABLE public.movies
  ADD COLUMN IF NOT EXISTS video_urls jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Storage buckets for admin-uploaded movie assets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('movie-thumbnails', 'movie-thumbnails', true),
  ('movie-backdrops', 'movie-backdrops', true),
  ('movie-videos', 'movie-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for the three buckets
CREATE POLICY "Public read movie assets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('movie-thumbnails','movie-backdrops','movie-videos'));

-- Admin write/update/delete
CREATE POLICY "Admins upload movie assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('movie-thumbnails','movie-backdrops','movie-videos')
  AND (public.is_admin_email() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Admins update movie assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('movie-thumbnails','movie-backdrops','movie-videos')
  AND (public.is_admin_email() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Admins delete movie assets"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('movie-thumbnails','movie-backdrops','movie-videos')
  AND (public.is_admin_email() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);