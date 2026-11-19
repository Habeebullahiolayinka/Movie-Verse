import { useNavigate } from "react-router-dom";
import { useActivityLog } from "../hooks/useActivity";
import { useRequireAuth } from "../hooks/useRequiredAuth";
import { useWatched } from "../hooks/useWatched";
import { useWatchlist } from "../hooks/useWatchlist";
import type { Movie } from "../data/movie ";
import type { MediaKind } from "../types/passport";

type WatchActionsProps = {
    movie: Movie;
    kind: MediaKind;
};

export default function WatchActions({ movie, kind }: WatchActionsProps) {
    const navigate = useNavigate();
    const { requireAuth } = useRequireAuth();
    const { logActivity } = useActivityLog();
    const { isInWatchlist, toggleWatchlist } = useWatchlist(kind);
    const { isWatched, markWatched } = useWatched(kind);

    const watched = isWatched(movie.id);
    const inWatchlist = isInWatchlist(movie.id);

    function handleWatch() {
        requireAuth(() => {
            if (!watched) {
                markWatched(movie);
                logActivity("watched-added", kind, movie);
            }
            navigate(`/watch/${kind}/${movie.id}`);
        });
    }

    function handleWatchlist() {
        requireAuth(() => {
            logActivity(inWatchlist ? "watchlist-removed" : "watchlist-added", kind, movie);
            toggleWatchlist(movie);
        });
    }

    return (
        <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
                type="button"
                onClick={handleWatch}
                className="rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
            >
                ▶ {kind === "movie" ? "Watch movie" : "Watch series"}
            </button>

            <button
                type="button"
                onClick={handleWatchlist}
                aria-pressed={inWatchlist}
                className={
                    "rounded-md border px-5 py-3 text-sm font-semibold transition " +
                    (inWatchlist
                        ? "border-accent bg-accent text-white"
                        : "border-line text-ink hover:bg-card")
                }
            >
                {inWatchlist ? "✓ In watchlist" : "+ Watchlist"}
            </button>

            {watched && <span className="text-sm text-muted">✓ Watched</span>}
        </div>
    );
}