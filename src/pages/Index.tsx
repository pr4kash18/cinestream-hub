import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieSlider from "@/components/MovieSlider";
import Footer from "@/components/Footer";
import { movies, trendingMovies, premiumMovies, freeMovies, newReleases, getMoviesByGenre } from "@/data/movies";

const Index = () => {
  const heroMovie = movies[1]; // Neon Dreams

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner movie={heroMovie} />
      <div className="-mt-16 relative z-10">
        <MovieSlider title="🔥 Trending Now" movies={trendingMovies} accent />
        <MovieSlider title="New Releases" movies={newReleases} />
        <MovieSlider title="Free to Watch" movies={freeMovies} />
        <MovieSlider title="⭐ Premium Collection" movies={premiumMovies} />
        <MovieSlider title="Action & Thriller" movies={getMoviesByGenre("Action")} />
        <MovieSlider title="Sci-Fi & Fantasy" movies={getMoviesByGenre("Sci-Fi")} />
        <MovieSlider title="Drama" movies={getMoviesByGenre("Drama")} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
