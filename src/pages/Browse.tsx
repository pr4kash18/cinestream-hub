import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import FiltersBar, { applyFilters, defaultFilters, type FilterState } from "@/components/FiltersBar";
import { useMovies } from "@/hooks/useMovies";
import { dbToMovie } from "@/lib/movieUtils";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre") || "";
  const initialFilter = searchParams.get("filter") || "";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    genres: initialGenre ? [initialGenre] : [],
    access: initialFilter === "free" || initialFilter === "premium" ? initialFilter : "",
  });

  const { data: dbMovies, isLoading } = useMovies();

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  const createdAtMap = useMemo(() => {
    const map: Record<string, string> = {};
    (dbMovies || []).forEach((m) => { map[m.id] = m.created_at; });
    return map;
  }, [dbMovies]);

  const filtered = useMemo(() => {
    if (!dbMovies) return [];
    let result = dbMovies.map(dbToMovie);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }
    return applyFilters(result, filters, createdAtMap);
  }, [dbMovies, query, filters, createdAtMap]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Browse Movies</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, director, or genre..."
            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <FiltersBar
          movies={(dbMovies || []).map(dbToMovie)}
          filters={filters}
          onChange={setFilters}
        />

        {isLoading ? (
          <div className="text-center py-16"><p className="text-muted-foreground animate-pulse">Loading movies...</p></div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{filtered.length} movie{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((movie) => (<MovieCard key={movie.id} movie={movie} />))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16"><p className="text-lg text-muted-foreground">No movies found. Try adjusting your filters.</p></div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
