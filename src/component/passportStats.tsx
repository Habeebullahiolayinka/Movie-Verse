import type { PassportStats } from "../types/passport";

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-line bg-surface p-4">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
        </div>
    );
}

export default function PassportStatsPanel({ stats }: { stats: PassportStats }) {
    const na = "Not available yet";

    return (
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total watched" value={String(stats.viewedCount)} />
            <Stat label="Favorite genre" value={stats.favoriteGenre ?? na} />
            <Stat
                label="Total watch time"
                value={
                    stats.totalWatchMinutes === null
                        ? na
                        : `${Math.floor(stats.totalWatchMinutes / 60)}h ${stats.totalWatchMinutes % 60}m`
                }
            />
            <Stat label="Top language" value={stats.topLanguage ?? na} />
        </dl>
    );
}