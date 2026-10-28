import { useEffect, useState } from "react";
import type { Movie } from "../data/movie ";
import type { MediaKind } from "../types/passport";
import { readJson, writeJson } from "../utils/storage";

export function useWatchlist(kind: MediaKind) {
    const storageKey = kind === "movie" ? "watchlist" : "watchlist-series";

    const [watchlist, setWatchlist] = useState<Movie[]>(() =>
        readJson<Movie[]>(storageKey, [])
    );

    useEffect(() => {
        writeJson(storageKey, watchlist);
    }, [watchlist, storageKey]);

    function isInWatchlist(id: number) {
        return watchlist.some((item) => item.id === id);
    }

    function toggleWatchlist(movie: Movie) {
        setWatchlist((current) =>
            current.some((item) => item.id === movie.id)
                ? current.filter((item) => item.id !== movie.id)
                : [...current, movie]
        );
    }

    return { watchlist, isInWatchlist, toggleWatchlist };
}