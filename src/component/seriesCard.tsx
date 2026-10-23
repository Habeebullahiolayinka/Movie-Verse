import { Link } from "react-router-dom";
import type { Movie } from "../data/movie ";

type SeriesCardProps = {
    movie: Movie;
    isFavorite: boolean;
    onToggleFavorite: () => void;
};

export default function SeriesCard({
    movie,
    isFavorite,
    onToggleFavorite,
}: SeriesCardProps) {
    return (
        <article className="overflow-hidden rounded-lg border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40">
            <div className="relative">
                <img
                    src={movie.poster_path}
                    alt={`${movie.title} poster`}
                    className="aspect-[2/3] w-full object-cover"
                />
                <button
                    type="button"
                    onClick={onToggleFavorite}
                    aria-pressed={isFavorite}
                    aria-label={
                        isFavorite
                            ? `Remove ${movie.title} from favorites`
                            : `Add ${movie.title} to favorites`
                    }
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-lg text-accent"
                >
                    {isFavorite ? "♥" : "♡"}
                </button>
            </div>

            <div className="p-3">
                <h3 className="truncate font-semibold text-ink">{movie.title}</h3>
                <p className="text-sm text-muted">{movie.genre_ids}</p>
                <div className="mt-1 flex items-center justify-between text-sm text-muted">
                    <span>{movie.release_year}</span>
                    <span>★ {movie.vote_avarage}</span>
                </div>
                <Link
                    to={`/series/${movie.id}`}      
                    className="mt-2 inline-block text-sm text-accent-hover hover:underline"
                >
                    Series Detail                   
                </Link>
            </div>
        </article>
    );
}