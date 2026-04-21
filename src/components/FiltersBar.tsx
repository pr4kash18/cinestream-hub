import { useMemo, useState } from "react";
import { Filter, X, ArrowDownAZ } from "lucide-react";
import type { Movie } from "@/data/movies";
import { genres } from "@/data/movies";

export type SortKey = "newest" | "rating" | "views" | "year_desc" | "year_asc" | "title";

export interface FilterState {
  genres: string[];
  yearMin: number | null;
  yearMax: number | null;
  ratingMin: number;
  language: string;
  quality: string;
  access: "" | "free" | "premium";
  sort: SortKey;
}

export const defaultFilters: FilterState = {
  genres: [],
  yearMin: null,
  yearMax: null,
  ratingMin: 0,
  language: "",
  quality: "",
  access: "",
  sort: "newest",
};

export const applyFilters = (movies: Movie[], f: FilterState, createdAtMap?: Record<string, string>): Movie[] => {
  let result = [...movies];
  if (f.genres.length) result = result.filter((m) => m.genres.some((g) => f.genres.includes(g)));
  if (f.yearMin) result = result.filter((m) => m.year >= f.yearMin!);
  if (f.yearMax) result = result.filter((m) => m.year <= f.yearMax!);
  if (f.ratingMin > 0) result = result.filter((m) => m.rating >= f.ratingMin);
  if (f.language) result = result.filter((m) => m.language.toLowerCase() === f.language.toLowerCase());
  if (f.quality) result = result.filter((m) => m.quality.includes(f.quality));
  if (f.access === "free") result = result.filter((m) => !m.isPremium);
  if (f.access === "premium") result = result.filter((m) => m.isPremium);

  switch (f.sort) {
    case "rating": result.sort((a, b) => b.rating - a.rating); break;
    case "views": result.sort((a, b) => b.views - a.views); break;
    case "year_desc": result.sort((a, b) => b.year - a.year); break;
    case "year_asc": result.sort((a, b) => a.year - b.year); break;
    case "title": result.sort((a, b) => a.title.localeCompare(b.title)); break;
    case "newest":
    default:
      if (createdAtMap) {
        result.sort((a, b) => (createdAtMap[b.id] || "").localeCompare(createdAtMap[a.id] || ""));
      }
      break;
  }
  return result;
};

interface FiltersBarProps {
  movies: Movie[];
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

const FiltersBar = ({ movies, filters, onChange }: FiltersBarProps) => {
  const [open, setOpen] = useState(false);

  const { languages, qualities, yearBounds } = useMemo(() => {
    const langs = new Set<string>();
    const quals = new Set<string>();
    let minY = Infinity;
    let maxY = -Infinity;
    movies.forEach((m) => {
      if (m.language) langs.add(m.language);
      m.quality.forEach((q) => quals.add(q));
      if (m.year) {
        if (m.year < minY) minY = m.year;
        if (m.year > maxY) maxY = m.year;
      }
    });
    return {
      languages: Array.from(langs).sort(),
      qualities: Array.from(quals).sort(),
      yearBounds: { min: isFinite(minY) ? minY : 1990, max: isFinite(maxY) ? maxY : new Date().getFullYear() },
    };
  }, [movies]);

  const toggleGenre = (g: string) => {
    onChange({
      ...filters,
      genres: filters.genres.includes(g) ? filters.genres.filter((x) => x !== g) : [...filters.genres, g],
    });
  };

  const reset = () => onChange(defaultFilters);

  const activeCount =
    filters.genres.length +
    (filters.yearMin ? 1 : 0) +
    (filters.yearMax ? 1 : 0) +
    (filters.ratingMin > 0 ? 1 : 0) +
    (filters.language ? 1 : 0) +
    (filters.quality ? 1 : 0) +
    (filters.access ? 1 : 0);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass text-sm font-medium hover:bg-secondary/50 transition-colors"
        >
          <Filter className="w-4 h-4" /> Filters
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">{activeCount}</span>
          )}
        </button>

        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as SortKey })}
            className="appearance-none pl-9 pr-8 py-2.5 rounded-lg glass text-sm font-medium hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="rating">Highest rated</option>
            <option value="views">Most viewed</option>
            <option value="year_desc">Year: new to old</option>
            <option value="year_asc">Year: old to new</option>
            <option value="title">Title A–Z</option>
          </select>
          <ArrowDownAZ className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {activeCount > 0 && (
          <button onClick={reset} className="inline-flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {open && (
        <div className="glass rounded-xl p-4 mt-3 animate-fade-in space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Access</h3>
            <div className="flex flex-wrap gap-2">
              {(["", "free", "premium"] as const).map((a) => (
                <button
                  key={a || "all"}
                  onClick={() => onChange({ ...filters, access: a })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.access === a ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
                >
                  {a === "" ? "All" : a === "free" ? "Free" : "Premium"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Genre</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.genres.includes(g) ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Year range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={`From ${yearBounds.min}`}
                  value={filters.yearMin ?? ""}
                  onChange={(e) => onChange({ ...filters, yearMin: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                />
                <span className="text-muted-foreground">–</span>
                <input
                  type="number"
                  placeholder={`To ${yearBounds.max}`}
                  value={filters.yearMax ?? ""}
                  onChange={(e) => onChange({ ...filters, yearMax: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Min rating: <span className="text-foreground">{filters.ratingMin.toFixed(1)}</span>
              </h3>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={filters.ratingMin}
                onChange={(e) => onChange({ ...filters, ratingMin: parseFloat(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Language</h3>
              <select
                value={filters.language}
                onChange={(e) => onChange({ ...filters, language: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Any</option>
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Quality</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onChange({ ...filters, quality: "" })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!filters.quality ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
                >Any</button>
                {qualities.map((q) => (
                  <button
                    key={q}
                    onClick={() => onChange({ ...filters, quality: q })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.quality === q ? "gradient-cinematic text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
                  >{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersBar;
