import { useEffect, useState } from "react";
import type { Movie } from "../data/movie ";
import type { MediaKind } from "../types/passport";
import { readJson, writeJson } from "../utils/storage";

export type WatchedEntry = {
    media: Movie;
    watchedAt: string; // ISO date
};

export function useWatched(kind: MediaKind) {
    const storageKey = kind === "movie" ? "watched" : "watched-series";

    const [watched, setWatched] = useState<WatchedEntry[]>(() =>
        readJson<WatchedEntry[]>(storageKey, [])
    );

    useEffect(() => {
        writeJson(storageKey, watched);
    }, [watched, storageKey]);

    function isWatched(id: number) {
        return watched.some((entry) => entry.media.id === id);
    }

    function toggleWatched(movie: Movie) {
        setWatched((current) =>
            current.some((entry) => entry.media.id === movie.id)
                ? current.filter((entry) => entry.media.id !== movie.id)
                : [{ media: movie, watchedAt: new Date().toISOString() }, ...current]
        );
    }

    return { watched, isWatched, toggleWatched };
}