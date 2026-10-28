import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import type { ActivityAction, ActivityEvent } from "../types/passport";

const ACTION_TEXT: Record<ActivityAction, string> = {
    "favorite-added": "Added to favorites",
    "favorite-removed": "Removed from favorites",
    "watchlist-added": "Added to watchlist",
    "watchlist-removed": "Removed from watchlist",
    "watched-added": "Marked as watched",
    "watched-removed": "Unmarked as watched",
    viewed: "Viewed",
};

type PassportActivityProps = {
    events: ActivityEvent[];
    limit?: number;
};

export default function PassportActivity({ events, limit }: PassportActivityProps) {
    const shown = limit ? events.slice(0, limit) : events;

    if (shown.length === 0) {
        return (
            <p className="rounded-xl border border-line bg-card p-6 text-center text-muted">
                No activity yet. Mark a title as watched or add it to your watchlist.
            </p>
        );
    }

    return (
        <ul className="divide-y divide-line rounded-xl border border-line bg-card">
            {shown.map((event) => (
                <li key={event.id} className="flex items-center gap-4 p-4">
                    <img
                        src={event.media.poster_path}
                        alt=""
                        className="h-16 w-11 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <Link
                            to={`/${event.kind === "movie" ? "movies" : "series"}/${event.media.id}`}
                            className="block truncate font-semibold text-ink hover:underline"
                        >
                            {event.media.title}
                        </Link>
                        <p className="text-sm text-muted">{ACTION_TEXT[event.action]}</p>
                    </div>
                    <time dateTime={event.at} className="shrink-0 text-sm text-muted">
                        {formatDate(event.at)}
                    </time>
                </li>
            ))}
        </ul>
    );
}