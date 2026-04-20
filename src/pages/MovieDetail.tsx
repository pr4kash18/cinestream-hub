import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, Download, Heart, Share2, Star, Crown, Clock, Globe, Monitor, ArrowLeft, ThumbsUp, MessageSquare, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieSlider from "@/components/MovieSlider";
import Footer from "@/components/Footer";
import { useMovie, useMovies } from "@/hooks/useMovies";
import { dbToMovie } from "@/lib/movieUtils";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlistIds, useToggleWatchlist } from "@/hooks/useWatchlist";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dbMovie, isLoading } = useMovie(id || "");
  const { data: allMovies } = useMovies();
  const { user } = useAuth();
  const { data: watchlistIds } = useWatchlistIds();
  const toggle = useToggleWatchlist();
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [downloadOpen, setDownloadOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!dbMovie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Movie not found</h1>
          <Link to="/" className="text-primary hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  const movie = dbToMovie(dbMovie);
  const relatedMovies = (allMovies || [])
    .filter((m) => m.id !== movie.id && (m.genre || []).some((g) => movie.genres.includes(g)))
    .map(dbToMovie);

  const isIn = !!watchlistIds?.has(movie.id);
  const videoUrls = (movie.videoUrls || {}) as Record<string, string>;
  const availableQualities = movie.quality.filter((q) => videoUrls[q]);
  const fallbackUrl = movie.videoUrl;

  const triggerDownload = (q: string) => {
    const url = videoUrls[q] || fallbackUrl;
    if (!url) {
      toast.error("This movie has no downloadable file yet.");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `${movie.title} [${q}]`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadOpen(false);
    toast.success(`Downloading ${q}...`);
  };

  const formatViews = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : `${(n / 1000).toFixed(0)}K`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="relative z-10 -mt-48 sm:-mt-64 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 w-64 mx-auto md:mx-0">
            <div className="rounded-xl overflow-hidden shadow-card">
              <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
            </div>
          </div>

          <div className="flex-1 animate-fade-up">
            {movie.isPremium && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold border border-gold/30 mb-3">
                <Crown className="w-3 h-3" /> PREMIUM
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1 text-gold font-bold text-base"><Star className="w-4 h-4 fill-current" /> {movie.rating}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {movie.duration}</span>
              <span>{movie.year}</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {movie.language}</span>
              <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {formatViews(movie.likes)}</span>
              <span>{formatViews(movie.views)} views</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres.map((g) => (
                <Link key={g} to={`/genre/${g}`} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors">{g}</Link>
              ))}
            </div>

            <p className="text-foreground/75 leading-relaxed mb-6 max-w-2xl">{movie.description}</p>

            <div className="flex items-center gap-2 mb-6">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Quality:</span>
              {movie.quality.map((q) => (
                <button key={q} onClick={() => setSelectedQuality(q)} className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${selectedQuality === q ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}>{q}</button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg gradient-cinematic text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity">
                <Play className="w-5 h-5 fill-current" /> Watch Now
              </button>
              <button onClick={() => setDownloadOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass font-semibold hover:bg-secondary/50 transition-colors">
                <Download className="w-5 h-5" /> Download
              </button>
              <button
                onClick={() => {
                  if (!user) { navigate("/auth"); return; }
                  toggle.mutate({ movieId: movie.id, isIn });
                }}
                disabled={toggle.isPending}
                title={isIn ? "Remove from My List" : "Save to My List"}
                className={`p-3 rounded-lg glass transition-colors ${isIn ? "text-primary" : "hover:bg-secondary/50"}`}
              >
                {toggle.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className={`w-5 h-5 ${isIn ? "fill-current" : ""}`} />}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied");
                }}
                className="p-3 rounded-lg glass hover:bg-secondary/50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Director</h3>
                <p className="text-sm text-foreground">{movie.director}</p>
              </div>
              {movie.cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Cast</h3>
                  <p className="text-sm text-foreground">{movie.cast.join(", ")}</p>
                </div>
              )}
            </div>

            <div className="glass rounded-xl p-6 max-w-2xl">
              <h3 className="flex items-center gap-2 font-semibold mb-4"><MessageSquare className="w-5 h-5" /> Comments</h3>
              <p className="text-sm text-muted-foreground">Sign in to leave a comment and rate this movie.</p>
            </div>
          </div>
        </div>
      </div>

      {relatedMovies.length > 0 && (
        <div className="mt-16">
          <MovieSlider title="You Might Also Like" movies={relatedMovies} />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MovieDetail;
