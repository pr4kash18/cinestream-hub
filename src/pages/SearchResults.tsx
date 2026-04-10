import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { searchMovies } from "@/data/movies";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = useMemo(() => searchMovies(query), [query]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Search results for "<span className="text-gradient">{query}</span>"
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{results.length} result{results.length !== 1 ? "s" : ""}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No movies found for "{query}"</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
