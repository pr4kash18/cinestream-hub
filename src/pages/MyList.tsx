import { Link, Navigate } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { dbToMovie } from "@/lib/movieUtils";

const MyList = () => {
  const { user, loading } = useAuth();
  const { data, isLoading } = useWatchlist();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;

  const movies = (data || []).map((r) => dbToMovie(r.movies));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto pb-16">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-primary fill-current" />
          <h1 className="text-3xl sm:text-4xl font-extrabold">My List</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Your saved & favorite movies</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : movies.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">No movies saved yet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tap the heart on any movie to save it here.
            </p>
            <Link to="/browse" className="inline-block px-6 py-2.5 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm hover:opacity-90">
              Browse movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyList;
