import { useCallback, useEffect, useState } from "react";
import type { Movie } from "../data/movie ";

export function useRecentlyViewed(storageKey = "recent-movies", limit = 10) {
    const [recent, setRecent] = useState<Movie[]>(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(recent));
    }, [recent, storageKey]);

    // New movie goes first, any older copy is removed, list is cut to `limit`
    const addRecent = useCallback(
        (movie: Movie) => {
            setRecent((current) =>
                [movie, ...current.filter((item) => item.id !== movie.id)].slice(0, limit)
            );
        },
        [limit]
    );

    function clearRecent() {
        setRecent([]);
    }

    return { recent, addRecent, clearRecent };
}