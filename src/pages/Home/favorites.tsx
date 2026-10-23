import { Link } from "react-router-dom";
import Navbar from "../../component/navbar";
import MovieCard from "../../component/movieCard";
import SeriesCard from "../../component/seriesCard";
import Reveal from "../../component/reveal";
import { useFavorites } from "../../hooks/useFavorites";

export default function Favorites() {
    const movieFavorites = useFavorites();
    const seriesFavorites = useFavorites("favorites-series");

    const hasAny =
        movieFavorites.favorites.length > 0 ||
        seriesFavorites.favorites.length > 0;

    return (
        <div className="min-h-screen bg-base text-ink">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10 md:px-12">
                <h1 className="text-3xl font-extrabold md:text-4xl">My Favorites</h1>
                <p className="mt-2 text-muted">Everything you've saved in one place.</p>

                {!hasAny && (
                    <div className="mt-10 rounded-xl border border-line bg-card p-8 text-center">
                        <p className="text-muted">You haven't saved anything yet.</p>
                        <div className="mt-4 flex justify-center gap-3">
                            <Link
                                to="/movies"
                                className="rounded-md bg-accent px-5 py-2 font-semibold text-white hover:bg-accent-hover"
                            >
                                Browse Movies
                            </Link>
                            <Link
                                to="/series"
                                className="rounded-md border border-line px-5 py-2 font-semibold hover:bg-surface"
                            >
                                Browse Series
                            </Link>
                        </div>
                    </div>
                )}

                {movieFavorites.favorites.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-6 text-2xl font-bold">Movies</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                            {movieFavorites.favorites.map((movie, index) => (
                                <Reveal key={movie.id} delay={(index % 5) * 60}>
                                    <MovieCard
                                        movie={movie}
                                        isFavorite
                                        onToggleFavorite={() =>
                                            movieFavorites.toggleFavorite(movie)
                                        }
                                    />
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                {seriesFavorites.favorites.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-6 text-2xl font-bold">Series</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                            {seriesFavorites.favorites.map((show, index) => (
                                <Reveal key={show.id} delay={(index % 5) * 60}>
                                    <SeriesCard
                                        movie={show}
                                        isFavorite
                                        onToggleFavorite={() =>
                                            seriesFavorites.toggleFavorite(show)
                                        }
                                    />
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}