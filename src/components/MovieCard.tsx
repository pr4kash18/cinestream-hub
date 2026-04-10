import { Star, Crown, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Movie } from "@/data/movies";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative flex-shrink-0 w-[160px] sm:w-[200px] rounded-lg overflow-hidden shadow-card transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full gradient-cinematic flex items-center justify-center shadow-glow">
            <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>
        {/* Premium badge */}
        {movie.isPremium && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/90 text-gold-foreground text-[10px] font-bold">
            <Crown className="w-2.5 h-2.5" />
            PRO
          </div>
        )}
        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full glass text-xs font-semibold">
          <Star className="w-3 h-3 text-gold fill-current" />
          {movie.rating}
        </div>
      </div>
      {/* Info */}
      <div className="p-2 bg-card">
        <h3 className="text-sm font-semibold truncate text-foreground">{movie.title}</h3>
        <p className="text-xs text-muted-foreground">{movie.year} • {movie.genres[0]}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
