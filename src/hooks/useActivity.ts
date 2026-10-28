import { useCallback, useEffect, useState } from "react";
import type { Movie } from "../data/movie ";
import type { ActivityAction, ActivityEvent, MediaKind } from "../types/passport";
import { readJson, writeJson } from "../utils/storage";

const STORAGE_KEY = "activity-log";
const LIMIT = 50;

export function useActivityLog() {
    const [events, setEvents] = useState<ActivityEvent[]>(() =>
        readJson<ActivityEvent[]>(STORAGE_KEY, [])
    );

    useEffect(() => {
        writeJson(STORAGE_KEY, events);
    }, [events]);

    const logActivity = useCallback(
        (action: ActivityAction, kind: MediaKind, movie: Movie) => {
            const event: ActivityEvent = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                action,
                kind,
                media: {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                },
                at: new Date().toISOString(),
            };
            setEvents((current) => [event, ...current].slice(0, LIMIT));
        },
        []
    );

    return { events, logActivity };
}