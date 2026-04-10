import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { useMovies } from "@/hooks/useMovies";
import { dbToMovie } from "@/lib/movieUtils";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data: results, isLoading } = useMovies({ search: query });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Search results for "<span className="text-gradient">{query}</span>"
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{results?.length || 0} result{(results?.length || 0) !== 1 ? "s" : ""}</p>
        {isLoading ? (
          <div className="text-center py-16"><p className="text-muted-foreground animate-pulse">Searching...</p></div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results?.map((m) => <MovieCard key={m.id} movie={dbToMovie(m)} />)}
            </div>
            {(!results || results.length === 0) && (
              <div className="text-center py-16"><p className="text-lg text-muted-foreground">No movies found for "{query}"</p></div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
