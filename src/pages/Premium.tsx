import { Crown } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { useMovies } from "@/hooks/useMovies";
import { dbToMovie } from "@/lib/movieUtils";

const Premium = () => {
  const { data: movies, isLoading } = useMovies({ type: "premium" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 flex items-center gap-3">
          <Crown className="w-8 h-8 text-gold" /> Premium Collection
        </h1>
        <p className="text-sm text-muted-foreground mb-8">Exclusive premium content for subscribers</p>
        {isLoading ? (
          <div className="text-center py-16"><p className="text-muted-foreground animate-pulse">Loading...</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies?.map((m) => <MovieCard key={m.id} movie={dbToMovie(m)} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Premium;
