import type { DbMovie } from "@/hooks/useMovies";
import type { Movie } from "@/data/movies";

export const dbToMovie = (m: DbMovie): Movie => ({
  id: m.id,
  title: m.title,
  description: m.description || "",
  year: m.year || 0,
  rating: m.rating || 0,
  duration: m.duration || "",
  genres: m.genre || [],
  language: m.language || "English",
  quality: m.quality || ["1080p"],
  isPremium: m.type === "premium",
  posterUrl: m.thumbnail || "",
  backdropUrl: m.backdrop_url || "",
  cast: m.cast_members || [],
  director: m.director || "",
  trailerUrl: m.trailer_url || undefined,
  views: m.views || 0,
  likes: m.likes || 0,
  videoUrl: m.video_url || undefined,
  videoUrls: (m.video_urls as Record<string, string> | null) || {},
});
