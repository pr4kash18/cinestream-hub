import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { Movie } from "@/data/movies";

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  accent?: boolean;
}

const MovieSlider = ({ title, movies, accent }: MovieSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="relative py-6">
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 px-4 sm:px-8 lg:px-16 ${accent ? "text-gradient" : "text-foreground"}`}>
        {title}
      </h2>
      <div className="group relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-20 w-10 sm:w-12 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-background/80"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-10 sm:w-12 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-background/80"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>

        {/* Movie list */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-8 lg:px-16"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSlider;
