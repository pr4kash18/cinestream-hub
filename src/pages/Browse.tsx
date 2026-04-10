import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { movies, genres } from "@/data/movies";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre") || "";
  const initialFilter = searchParams.get("filter") || "";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [filterType, setFilterType] = useState(initialFilter);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = movies;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }
    if (selectedGenre) {
      result = result.filter((m) => m.genres.includes(selectedGenre));
    }
    if (filterType === "free") result = result.filter((m) => !m.isPremium);
    if (filterType === "premium") result = result.filter((m) => m.isPremium);
    return result;
  }, [query, selectedGenre, filterType]);

  const clearFilters = () => {
    setQuery("");
    setSelectedGenre("");
    setFilterType("");
  };

  const hasFilters = query || selectedGenre || filterType;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Browse Movies</h1>

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, director, or genre..."
              className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="glass rounded-xl p-4 mb-6 animate-fade-in">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Access</h3>
              <div className="flex flex-wrap gap-2">
                {["", "free", "premium"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filterType === f ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {f === "" ? "All" : f === "free" ? "Free" : "Premium"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Genre</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGenre("")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !selectedGenre ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  All
                </button>
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedGenre === g ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} movie{filtered.length !== 1 ? "s" : ""} found
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No movies found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
