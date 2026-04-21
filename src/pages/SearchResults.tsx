import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import FiltersBar, { applyFilters, defaultFilters, type FilterState } from "@/components/FiltersBar";
import { useMovies } from "@/hooks/useMovies";
import { dbToMovie } from "@/lib/movieUtils";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data: results, isLoading } = useMovies({ search: query });
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const createdAtMap = useMemo(() => {
    const map: Record<string, string> = {};
    (results || []).forEach((m) => { map[m.id] = m.created_at; });
    return map;
  }, [results]);

  const movies = useMemo(() => (results || []).map(dbToMovie), [results]);
  const filtered = useMemo(() => applyFilters(movies, filters, createdAtMap), [movies, filters, createdAtMap]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Search results for "<span className="text-gradient">{query}</span>"
        </h1>
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>

        {movies.length > 0 && (
          <FiltersBar movies={movies} filters={filters} onChange={setFilters} />
        )}

        {isLoading ? (
          <div className="text-center py-16"><p className="text-muted-foreground animate-pulse">Searching...</p></div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">No movies found{query ? ` for "${query}"` : ""}.</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
