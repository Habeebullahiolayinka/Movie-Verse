import Navbar from "../../component/navbar";
import PassportProfile from "../../component/passportProfile";
import PassportTabs from "../../component/passportTabs";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { usePassportTab } from "../../hooks/usePassportTab";
import PassportStatsPanel from "../../component/passportStats";
import PassportCollection from "../../component/passportCollection";
import { usePassportData } from "../../hooks/usePassportData";
import PassportActivity from "../../component/passportActivity";
import PassportHistory from "../../component/passportHistory";



export default function PassportPage() {
    usePageTitle("My Passport");

    const { user } = useAuth();
    const { tab, setTab } = usePassportTab();
    const { favorites, watchlist, history, events, stats, toggleFavorite } = usePassportData();

    const displayName = user?.name ?? "Movie fan";
    

    return (
        <div className="min-h-screen bg-base text-ink">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10 md:px-12">
                <header className="mb-8 flex items-center gap-4">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-10 w-10 shrink-0 text-accent"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <rect x="5" y="2.5" width="14" height="19" rx="2" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M8.5 17h7" />
                    </svg>
                    <div>
                        <h1 className="text-3xl font-extrabold md:text-4xl">My Passport</h1>
                        <p className="mt-1 text-muted">Your movie journey, all in one place.</p>
                    </div>
                </header>

                <PassportProfile
                    displayName={displayName}
                    memberSince={null}
                    watched={stats.viewedCount}
                    favorites={stats.favoritesCount}
                    watchlist={stats.watchlistCount}
                />

                <div className="mt-8">
                    <PassportTabs active={tab} onChange={setTab} />

                    <div
                        role="tabpanel"
                        id={`passport-panel-${tab}`}
                        aria-labelledby={`passport-tab-${tab}`}
                        tabIndex={0}
                        className="py-8"
                    >
                        {tab === "overview" && (
                            <div className="space-y-10">
                                <PassportStatsPanel stats={stats} />
                                <section>
                                    <h2 className="mb-4 text-xl font-bold">Recently saved</h2>
                                    <PassportCollection
                                        items={[...favorites, ...watchlist].slice(0, 5)}
                                        emptyMessage="Nothing saved yet. Heart a title or add it to your watchlist."
                                        isFavorite={(item) => favorites.some((f) => f.kind === item.kind && f.media.id === item.media.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                </section>

                                <section>
                                    <h2 className="mb-4 text-xl font-bold">Recent activity</h2>
                                    <PassportActivity events={events} limit={5} />
                                </section>
                            </div>
                        )}

                        {tab === "favorites" && (
                            <PassportCollection
                                items={favorites}
                                emptyMessage="You haven't added any favorites yet."
                                isFavorite={() => true}
                                onToggleFavorite={toggleFavorite}
                            />
                        )}

                        {tab === "watchlist" && (
                            <PassportCollection
                                items={watchlist}
                                emptyMessage="Your watchlist is empty. Use + Watchlist on a detail page."
                                isFavorite={(item) => favorites.some((f) => f.kind === item.kind && f.media.id === item.media.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        )}

                        {tab === "history" && (
                            <div className="space-y-10">
                                <section>
                                    <h2 className="mb-4 text-xl font-bold">Watched</h2>
                                    <PassportHistory rows={history} />
                                </section>
                                <section>
                                    <h2 className="mb-4 text-xl font-bold">All activity</h2>
                                    <PassportActivity events={events} />
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}