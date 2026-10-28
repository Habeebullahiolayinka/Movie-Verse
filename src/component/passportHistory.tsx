import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import type { WatchedEntry } from "../hooks/useWatched";
import type { MediaKind } from "../types/passport";

export type HistoryRow = WatchedEntry & { kind: MediaKind };

export default function PassportHistory({ rows }: { rows: HistoryRow[] }) {
    if (rows.length === 0) {
        return (
            <p className="rounded-xl border border-line bg-card p-8 text-center text-muted">
                Nothing marked as watched yet. Use "Mark as watched" on a detail page.
            </p>
        );
    }

    return (
        <ul className="divide-y divide-line rounded-xl border border-line bg-card">
            {rows.map((row) => (
                <li key={`${row.kind}-${row.media.id}`} className="flex items-center gap-4 p-4">
                    <img
                        src={row.media.poster_path}
                        alt=""
                        className="h-20 w-14 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <Link
                            to={`/${row.kind === "movie" ? "movies" : "series"}/${row.media.id}`}
                            className="block truncate font-semibold text-ink hover:underline"
                        >
                            {row.media.title}
                        </Link>
                        <p className="text-sm text-muted">
                            {row.kind === "movie" ? "Movie" : "Series"} · {row.media.release_year}
                        </p>
                    </div>
                    <time dateTime={row.watchedAt} className="shrink-0 text-sm text-muted">
                        {formatDate(row.watchedAt)}
                    </time>
                </li>
            ))}
        </ul>
    );
}