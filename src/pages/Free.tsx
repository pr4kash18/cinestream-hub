import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { freeMovies } from "@/data/movies";

const Free = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Free Movies</h1>
      <p className="text-sm text-muted-foreground mb-8">Enjoy these movies at no cost</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {freeMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default Free;
