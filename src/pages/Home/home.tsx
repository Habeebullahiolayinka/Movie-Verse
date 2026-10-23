import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "../../component/navbar";
import HeroSlideshow from "../../component/heroSlideShow";
import { fetchMovies, fetchSeries } from "../../api/movies";
import { useFavorites } from "../../hooks/useFavorites";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import { TrendingSection } from "../../component/Trending";
import MovieCard from "../../component/movieCard";
import SeriesCard from "../../component/seriesCard";
import Reveal from "../../component/reveal";

import SearchBar from "../../component/searchBar";


export default function HomePage() {
    const moviesQuery = useInfiniteQuery({
        queryKey: ["movies", ""],
        queryFn: ({ pageParam }) => fetchMovies("", pageParam),
        initialPageParam: 1,
        getNextPageParam: (last) =>
            last.page < last.totalPages ? last.page + 1 : undefined,
    });

    const seriesQuery = useInfiniteQuery({
        queryKey: ["series", ""],
        queryFn: ({ pageParam }) => fetchSeries("", pageParam),
        initialPageParam: 1,
        getNextPageParam: (last) =>
            last.page < last.totalPages ? last.page + 1 : undefined,
    });

    const movieFavorites = useFavorites();
    const seriesFavorites = useFavorites("favorites-series");
    const { recent, clearRecent } = useRecentlyViewed();

    const movies = moviesQuery.data?.pages.flatMap((page) => page.movies) ?? [];
    const series = seriesQuery.data?.pages.flatMap((page) => page.movies) ?? [];

    const heroImages = movies
    .map((movie) => movie.backdrop_path)
    .filter((path): path is string => Boolean(path))
    .slice(0, 8);

    return (
        <div className="min-h-screen bg-base text-ink">
            {/* hero: slideshow + navbar + text */}
            <div className="relative flex min-h-[85vh] flex-col overflow-hidden">
                <HeroSlideshow images={heroImages} />

                {/* bottom fade uses the real page color, so it blends in both themes */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base to-transparent" />

                <div
                    data-theme="dark"
                    className="relative z-10 flex flex-1 flex-col text-ink"
                >
                    <Navbar transparent />

                    <header className="flex flex-1 items-center">
                        <div className="mx-auto w-full max-w-7xl px-4 py-20">
                            <h1 className="animate-fade-up max-w-2xl text-4xl font-extrabold drop-shadow-lg md:text-6xl">
                                Unlimited movies, series and more
                            </h1>
                            <p
                                className="animate-fade-up mt-4 max-w-xl text-lg text-ink/90 drop-shadow"
                                style={{ animationDelay: "120ms" }}
                            >
                                Discover what is trending, save your favorites and pick
                                up where you left off.
                            </p>

                            <div
                                className="animate-fade-up mt-8"
                                style={{ animationDelay: "180ms" }}
                            >
                                <SearchBar />
                            </div>

                            <div
                                className="animate-fade-up mt-6 flex flex-wrap gap-3"
                                style={{ animationDelay: "300ms" }}
                            >
                                <Link
                                    to="/movies"
                                    className="rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
                                >
                                    Explore Movies
                                </Link>
                                <Link
                                    to="/series"
                                    className="rounded-md border border-ink/40 bg-base/40 px-6 py-3 font-semibold text-ink backdrop-blur transition hover:bg-base/70"
                                >
                                    Browse Series
                                </Link>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
            {/* hero ends here */}

            <Reveal>
                {recent.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 pt-10 animate-fade-up">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Continue Watching</h2>
                        <button
                            type="button"
                            onClick={clearRecent}
                            className="text-sm text-muted hover:text-ink"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {recent.map((movie) => (
                            <Link
                                key={movie.id}
                                to={`/movies/${movie.id}`}
                                className="w-32 shrink-0 transition hover:-translate-y-1"
                            >
                                <img
                                    src={movie.poster_path}
                                    alt={movie.title}
                                    className="aspect-[2/3] w-full rounded-lg object-cover"
                                />
                                <p className="mt-2 truncate text-sm">{movie.title}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <TrendingSection
                title="Trending Movies"
                linkTo="/movies"
                linkLabel="See all movie"
                items={movies.slice(0, 8)}
                isLoading={moviesQuery.isLoading}
                isError={moviesQuery.isError}
                onRetry={() => moviesQuery.refetch()}
                renderCard={(item) => (
                    <MovieCard
                        movie={item}
                        isFavorite={movieFavorites.favorites.some((f) => f.id === item.id)}
                        onToggleFavorite={() => movieFavorites.toggleFavorite(item)}
                    />
                )}
            />

            <TrendingSection
                title="Trending Series"
                linkTo="/series"
                linkLabel="See all series"
                items={series.slice(0, 8)}
                isLoading={seriesQuery.isLoading}
                isError={seriesQuery.isError}
                onRetry={() => seriesQuery.refetch()}
                renderCard={(item) => (
                    <SeriesCard
                        movie={item}
                        isFavorite={seriesFavorites.favorites.some((f) => f.id === item.id)}
                        onToggleFavorite={() => seriesFavorites.toggleFavorite(item)}
                    />
                )}
            />
            </Reveal>

        </div>
    );
}