import type { Movie } from "../data/movie "; // use the same path your other files use

export const PASSPORT_TABS = [
    { id: "overview", label: "Overview" },
    { id: "favorites", label: "Favorites" },
    { id: "watchlist", label: "Watchlist" },
    { id: "history", label: "History" },
] as const;

export type PassportTab = (typeof PASSPORT_TABS)[number]["id"];

export type MediaKind = "movie" | "series";

export type PassportItem = {
    kind: MediaKind;
    media: Movie;
};

export type ActivityAction =
    | "favorite-added"
    | "favorite-removed"
    | "watchlist-added"
    | "watchlist-removed"
    | "watched-added"
    | "watched-removed"
    | "viewed";

export type ActivityEvent = {
    id: string;
    action: ActivityAction;
    kind: MediaKind;
    media: Pick<Movie, "id" | "title" | "poster_path">;
    at: string; 
};

export type PassportProfile = {
    displayName: string;
    memberSince: string | null; 
};

export type PassportStats = {
    viewedCount: number;
    favoritesCount: number;
    watchlistCount: number;
    favoriteGenre: string | null;
    totalWatchMinutes: number | null; 
    topLanguage: string | null; 
};

export function itemKey(item: PassportItem): string {
    return `${item.kind}-${item.media.id}`;
}