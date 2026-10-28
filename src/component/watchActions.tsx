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
    const { requireAuth } = useRequireAuth();
    const { logActivity } = useActivityLog();
    const { isInWatchlist, toggleWatchlist } = useWatchlist(kind);
    const { isWatched, toggleWatched } = useWatched(kind);

    const watched = isWatched(movie.id);
    const inWatchlist = isInWatchlist(movie.id);

    function handleWatched() {
        requireAuth(() => {
            logActivity(watched ? "watched-removed" : "watched-added", kind, movie);
            toggleWatched(movie);
        });
    }

    function handleWatchlist() {
        requireAuth(() => {
            logActivity(inWatchlist ? "watchlist-removed" : "watchlist-added", kind, movie);
            toggleWatchlist(movie);
        });
    }

    const base = "rounded-md border px-5 py-2 text-sm font-semibold transition ";
    const on = "border-accent bg-accent text-white";
    const off = "border-line text-ink hover:bg-card";

    return (
        <div className="mt-6 flex flex-wrap gap-3">
            <button
                type="button"
                onClick={handleWatched}
                aria-pressed={watched}
                className={base + (watched ? on : off)}
            >
                {watched ? "✓ Watched" : "Mark as watched"}
            </button>

            <button
                type="button"
                onClick={handleWatchlist}
                aria-pressed={inWatchlist}
                className={base + (inWatchlist ? on : off)}
            >
                {inWatchlist ? "✓ In watchlist" : "+ Watchlist"}
            </button>
        </div>
    );
}