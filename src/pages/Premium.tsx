import { Crown, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { useMovies } from "@/hooks/useMovies";
import { dbToMovie } from "@/lib/movieUtils";
import { toast } from "sonner";

const tiers = [
  {
    name: "Pro",
    price: 9,
    popular: false,
    features: ["HD streaming (1080p)", "Watch on 2 devices", "Full premium catalog", "No ads"],
  },
  {
    name: "Premium",
    price: 25,
    popular: true,
    features: ["4K Ultra HD + HDR", "Watch on 4 devices", "Full premium catalog", "Offline downloads", "Early access releases", "Priority support"],
  },
];

const Premium = () => {
  const { data: movies, isLoading } = useMovies({ type: "premium" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <Crown className="w-3.5 h-3.5" /> CINESTREAM PREMIUM
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3">Choose your plan</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">Unlock exclusive movies, 4K streaming, and offline downloads.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {tiers.map((t) => (
            <div key={t.name} className={`relative glass rounded-2xl p-7 ${t.popular ? "border-2 border-gold" : ""}`}>
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-background text-xs font-bold">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{t.name}</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-extrabold">${t.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => toast.info("Payments coming soon!")}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 ${
                  t.popular ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-foreground border border-border"
                }`}
              >
                Subscribe to {t.name}
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <Crown className="w-6 h-6 text-gold" /> Premium Collection
        </h2>
        <p className="text-sm text-muted-foreground mb-6">Exclusive content for subscribers</p>
        {isLoading ? (
          <div className="text-center py-16"><p className="text-muted-foreground animate-pulse">Loading...</p></div>
        ) : movies?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-12">
            {movies.map((m) => <MovieCard key={m.id} movie={dbToMovie(m)} />)}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No premium content yet.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Premium;
