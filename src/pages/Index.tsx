import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieSlider from "@/components/MovieSlider";
import Footer from "@/components/Footer";
import { useMovies, useTrendingMovies, useNewReleases } from "@/hooks/useMovies";
import { dbToMovie } from "@/lib/movieUtils";

const Index = () => {
  const { data: allMovies, isLoading } = useMovies();
  const { data: trending } = useTrendingMovies();
  const { data: newReleases } = useNewReleases();
  const { data: freeMovies } = useMovies({ type: "free" });
  const { data: premiumMovies } = useMovies({ type: "premium" });
  const { data: actionMovies } = useMovies({ genre: "Action" });
  const { data: sciFiMovies } = useMovies({ genre: "Sci-Fi" });
  const { data: dramaMovies } = useMovies({ genre: "Drama" });

  const heroMovie = allMovies?.[1] ? dbToMovie(allMovies[1]) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading movies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {heroMovie && <HeroBanner movie={heroMovie} />}
      <div className="relative z-10 pt-4 pb-8 space-y-2">
        {trending && <MovieSlider title="🔥 Trending Now" movies={trending.map(dbToMovie)} accent />}
        {newReleases && <MovieSlider title="New Releases" movies={newReleases.map(dbToMovie)} />}
        {freeMovies && <MovieSlider title="Free to Watch" movies={freeMovies.map(dbToMovie)} />}
        {premiumMovies && <MovieSlider title="⭐ Premium Collection" movies={premiumMovies.map(dbToMovie)} />}
        {actionMovies && <MovieSlider title="Action & Thriller" movies={actionMovies.map(dbToMovie)} />}
        {sciFiMovies && <MovieSlider title="Sci-Fi & Fantasy" movies={sciFiMovies.map(dbToMovie)} />}
        {dramaMovies && <MovieSlider title="Drama" movies={dramaMovies.map(dbToMovie)} />}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
