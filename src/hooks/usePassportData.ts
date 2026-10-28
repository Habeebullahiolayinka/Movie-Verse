import { useFavorites } from "./useFavorites";
import { useWatched } from "./useWatched";
import { useWatchlist } from "./useWatchlist";
import type { PassportItem, PassportStats } from "../types/passport";
import { useActivityLog } from "./useActivity";
import type { HistoryRow } from "../component/passportHistory";

function mostCommon(values: string[]): string | null {
    if (values.length === 0) return null;
    const counts = new Map<string, number>();
    for (const value of values) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export function usePassportData() {
    const movieFavorites = useFavorites();
    const seriesFavorites = useFavorites("favorites-series");
    const movieWatchlist = useWatchlist("movie");
    const seriesWatchlist = useWatchlist("series");
    const movieWatched = useWatched("movie");
    const seriesWatched = useWatched("series");
    const { events } = useActivityLog();

    const history: HistoryRow[] = [
        ...movieWatched.watched.map((entry) => ({ ...entry, kind: "movie" as const })),
        ...seriesWatched.watched.map((entry) => ({ ...entry, kind: "series" as const })),
    ].sort((a, b) => b.watchedAt.localeCompare(a.watchedAt));

    const favorites: PassportItem[] = [
        ...movieFavorites.favorites.map((media) => ({ kind: "movie" as const, media })),
        ...seriesFavorites.favorites.map((media) => ({ kind: "series" as const, media })),
    ];

    const watchlist: PassportItem[] = [
        ...movieWatchlist.watchlist.map((media) => ({ kind: "movie" as const, media })),
        ...seriesWatchlist.watchlist.map((media) => ({ kind: "series" as const, media })),
    ];

    const watchedCount = movieWatched.watched.length + seriesWatched.watched.length;

    const stats: PassportStats = {
        viewedCount: watchedCount,
        favoritesCount: favorites.length,
        watchlistCount: watchlist.length,
        favoriteGenre: mostCommon(favorites.map((item) => item.media.genre_ids)),
        totalWatchMinutes: null, // Movie has no runtime field yet
        topLanguage: null, // Movie has no language field yet
    };

    function toggleFavorite(item: PassportItem) {
        if (item.kind === "movie") movieFavorites.toggleFavorite(item.media);
        else seriesFavorites.toggleFavorite(item.media);
    }

    return { favorites, history, events ,watchlist, stats, toggleFavorite };
}