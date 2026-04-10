import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { getMoviesByGenre, genres } from "@/data/movies";

const Genre = () => {
  const { name } = useParams();
  const genreName = name || "";
  const genreMovies = getMoviesByGenre(genreName);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">{genreName} Movies</h1>
        <p className="text-sm text-muted-foreground mb-6">{genreMovies.length} movie{genreMovies.length !== 1 ? "s" : ""}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map((g) => (
            <Link
              key={g}
              to={`/genre/${g}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                g === genreName ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {g}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {genreMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {genreMovies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No movies found in this genre.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Genre;
