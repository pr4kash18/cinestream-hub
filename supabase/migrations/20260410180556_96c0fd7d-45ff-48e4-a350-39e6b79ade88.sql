CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  backdrop_url TEXT,
  video_url TEXT,
  type TEXT NOT NULL DEFAULT 'free' CHECK (type IN ('free', 'premium')),
  genre TEXT[] DEFAULT '{}',
  rating NUMERIC(3,1) DEFAULT 0,
  year INTEGER,
  duration TEXT,
  language TEXT DEFAULT 'English',
  quality TEXT[] DEFAULT ARRAY['1080p', '720p'],
  cast_members TEXT[] DEFAULT '{}',
  director TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  trailer_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Movies are publicly readable"
  ON public.movies FOR SELECT
  USING (true);

CREATE INDEX idx_movies_type ON public.movies (type);
CREATE INDEX idx_movies_genre ON public.movies USING GIN (genre);
CREATE INDEX idx_movies_year ON public.movies (year);