import { Play, Info, Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Movie } from "@/data/movies";

interface HeroBannerProps {
  movie: Movie;
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
  return (
    <div className="relative h-[70vh] sm:h-[80vh] w-full overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="gradient-hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end h-full pb-16 sm:pb-24 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <div className="max-w-2xl animate-fade-up">
          {movie.isPremium && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold border border-gold/30 mb-4">
              <Crown className="w-3 h-3" />
              PREMIUM
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-3">
            {movie.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1 text-gold font-semibold">
              <Star className="w-4 h-4 fill-current" />
              {movie.rating}
            </span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
            <span>{movie.genres.join(" • ")}</span>
          </div>
          <p className="text-foreground/70 text-sm sm:text-base line-clamp-3 mb-6">
            {movie.description}
          </p>
          <div className="flex items-center gap-3">
            <Link
              to={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-cinematic text-primary-foreground font-semibold text-sm shadow-glow hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Now
            </Link>
            <Link
              to={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass text-foreground font-semibold text-sm hover:bg-secondary/50 transition-colors"
            >
              <Info className="w-4 h-4" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
