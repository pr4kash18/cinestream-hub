import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Film, Crown, Eye, ThumbsUp, Star, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMovies } from "@/hooks/useMovies";

const StatCard = ({ icon: Icon, label, value, accent }: { icon: typeof Film; label: string; value: string | number; accent?: string }) => (
  <div className="glass rounded-xl p-4">
    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
      <Icon className={`w-4 h-4 ${accent || "text-primary"}`} />
      {label}
    </div>
    <p className="text-2xl font-extrabold">{value}</p>
  </div>
);

const AdminAnalytics = () => {
  const { data: movies, isLoading } = useMovies();

  const { data: counts, isLoading: countsLoading } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const [contact, watchlist] = await Promise.all([
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("watchlist").select("*", { count: "exact", head: true }),
      ]);
      return {
        messages: contact.count ?? 0,
        watchlist: watchlist.count ?? 0,
      };
    },
  });

  const stats = useMemo(() => {
    const list = movies || [];
    const total = list.length;
    const premium = list.filter((m) => m.type === "premium").length;
    const free = total - premium;
    const totalViews = list.reduce((s, m) => s + (m.views || 0), 0);
    const totalLikes = list.reduce((s, m) => s + (m.likes || 0), 0);
    const avgRating = total ? list.reduce((s, m) => s + (m.rating || 0), 0) / total : 0;
    const top = [...list].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
    return { total, premium, free, totalViews, totalLikes, avgRating, top };
  }, [movies]);

  if (isLoading || countsLoading) {
    return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Film} label="Total movies" value={stats.total} />
        <StatCard icon={Crown} label="Premium" value={stats.premium} accent="text-gold" />
        <StatCard icon={Film} label="Free" value={stats.free} />
        <StatCard icon={Star} label="Avg rating" value={stats.avgRating.toFixed(1)} accent="text-gold" />
        <StatCard icon={Eye} label="Total views" value={stats.totalViews.toLocaleString()} />
        <StatCard icon={ThumbsUp} label="Total likes" value={stats.totalLikes.toLocaleString()} />
        <StatCard icon={Mail} label="Messages" value={counts?.messages ?? 0} />
        <StatCard icon={Film} label="Watchlist saves" value={counts?.watchlist ?? 0} />
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Eye className="w-5 h-5" /> Top 10 most viewed</h3>
        {stats.top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No movies yet.</p>
        ) : (
          <ol className="space-y-2">
            {stats.top.map((m, i) => (
              <li key={m.id} className="flex items-center gap-3 bg-secondary/40 rounded-lg p-2.5">
                <span className="text-lg font-extrabold text-primary w-6 text-center">{i + 1}</span>
                {m.thumbnail && <img src={m.thumbnail} alt="" className="w-10 h-14 object-cover rounded" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.year} · {m.type}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-foreground">{(m.views || 0).toLocaleString()} views</p>
                  <p className="text-muted-foreground">{(m.likes || 0).toLocaleString()} likes</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
