import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { DbMovie } from "@/hooks/useMovies";

export const useWatchlist = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["watchlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("movie_id, created_at, movies(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Array<{ movie_id: string; created_at: string; movies: DbMovie }>;
    },
  });
};

export const useWatchlistIds = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["watchlist-ids", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("watchlist").select("movie_id");
      if (error) throw error;
      return new Set((data || []).map((r) => r.movie_id));
    },
  });
};

export const useToggleWatchlist = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ movieId, isIn }: { movieId: string; isIn: boolean }) => {
      if (!user) throw new Error("Sign in to save movies");
      if (isIn) {
        const { error } = await supabase.from("watchlist").delete().eq("movie_id", movieId).eq("user_id", user.id);
        if (error) throw error;
        return { added: false };
      }
      const { error } = await supabase.from("watchlist").insert({ movie_id: movieId, user_id: user.id });
      if (error) throw error;
      return { added: true };
    },
    onSuccess: ({ added }) => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      qc.invalidateQueries({ queryKey: ["watchlist-ids"] });
      toast.success(added ? "Added to My List ❤️" : "Removed from My List");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
