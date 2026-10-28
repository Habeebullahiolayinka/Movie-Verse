type PassportProfileProps = {
    displayName: string;
    memberSince: string | null;
    watched: number;
    favorites: number;
    watchlist: number;
};

function Count({ label, value }: { label: string; value: number }) {
    return (
        <div className="text-center">
            <p className="text-2xl font-extrabold text-ink">{value}</p>
            <p className="text-sm text-muted">{label}</p>
        </div>
    );
}

export default function PassportProfile({
    displayName,
    memberSince,
    watched,
    favorites,
    watchlist,
}: PassportProfileProps) {
    const initial = displayName.trim().charAt(0).toUpperCase() || "?";

    return (
        <section
            aria-label="Profile summary"
            className="flex flex-col gap-6 rounded-xl border border-line bg-card p-6 sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="flex items-center gap-4">
                <div
                    aria-hidden="true"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white"
                >
                    {initial}
                </div>
                <div className="min-w-0">
                    <h2 className="truncate text-xl font-bold text-ink">{displayName}</h2>
                    <p className="text-sm text-muted">
                        {memberSince
                            ? `Member since ${memberSince}`
                            : "Member since: not available yet"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <Count label="Watched" value={watched} />
                <Count label="Favorites" value={favorites} />
                <Count label="Watchlist" value={watchlist} />
            </div>
        </section>
    );
}