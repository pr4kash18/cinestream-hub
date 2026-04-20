import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbMovie {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  backdrop_url: string | null;
  video_url: string | null;
  type: string;
  genre: string[];
  rating: number | null;
  year: number | null;
  duration: string | null;
  language: string | null;
  quality: string[];
  cast_members: string[];
  director: string | null;
  views: number;
  likes: number;
  trailer_url: string | null;
  video_urls: Record<string, string> | null;
  created_at: string;
}

const fetchMovies = async (filters?: { type?: string; genre?: string; search?: string }): Promise<DbMovie[]> => {
  let query = supabase.from("movies").select("*");

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }
  if (filters?.genre) {
    query = query.contains("genre", [filters.genre]);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,director.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbMovie[]) || [];
};

export const useMovies = (filters?: { type?: string; genre?: string; search?: string }) =>
  useQuery({
    queryKey: ["movies", filters],
    queryFn: () => fetchMovies(filters),
  });

export const useMovie = (id: string) =>
  useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("movies").select("*").eq("id", id).single();
      if (error) throw error;
      return data as DbMovie;
    },
    enabled: !!id,
  });

export const useTrendingMovies = () =>
  useQuery({
    queryKey: ["movies", "trending"],
    queryFn: async () => {
      const { data, error } = await supabase.from("movies").select("*").gt("views", 1000000).order("views", { ascending: false });
      if (error) throw error;
      return (data as DbMovie[]) || [];
    },
  });

export const useNewReleases = () =>
  useQuery({
    queryKey: ["movies", "new"],
    queryFn: async () => {
      const { data, error } = await supabase.from("movies").select("*").eq("year", 2024).order("created_at", { ascending: false });
      if (error) throw error;
      return (data as DbMovie[]) || [];
    },
  });
