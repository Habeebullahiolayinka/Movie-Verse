import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../component/navbar";
import MovieCard from "../../component/movieCard";
import SearchBar from "../../component/searchBar";
import { fetchMovies, fetchSeries } from "../../api/movies";
import { useFavorites } from "../../hooks/useFavorites";
import type { Movie } from "../../data/movie ";

type ResultsRowProps = {
    title: string;
    query: string;
    items: Movie[];
    isLoading: boolean;
    isError: boolean;
    favorites: Movie[];
    onToggleFavorite: (item: Movie) => void;
    getDetailsPath: (item: Movie) => string;
};

function ResultsRow({
    title, 
    query,
    items,
    isLoading,
    isError,
    favorites,
    onToggleFavorite,
}: ResultsRowProps) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8">
            <h2 className="mb-6 text-2xl font-bold text-ink">{title}</h2>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-[2/3] animate-pulse rounded-lg bg-card"
                        />
                    ))}
                </div>
            ) : isError ? (
                <p className="text-danger">Could not load {title.toLowerCase()}.</p>
            ) : items.length === 0 ? (
                <p className="text-muted">
                    No {title.toLowerCase()} match “{query}”.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((item) => (
                        <MovieCard
                            key={item.id}
                            movie={item}
                            isFavorite={favorites.some((f) => f.id === item.id)}
                            onToggleFavorite={() => onToggleFavorite(item)}
                            // detailsPath={getDetailsPath(item)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default function SearchPage() {
    const [params] = useSearchParams();
    const query = (params.get("q") ?? "").trim();

    const moviesQuery = useQuery({
        queryKey: ["search-movies", query],
        queryFn: () => fetchMovies(query, 1),
        enabled: query.length > 0,
    });

    const seriesQuery = useQuery({
        queryKey: ["search-series", query],
        queryFn: () => fetchSeries(query, 1),
        enabled: query.length > 0,
    });

    const movieFavorites = useFavorites();
    const seriesFavorites = useFavorites("favorites-series");

    return (
        <div className="min-h-screen bg-base text-ink">
            <Navbar />

            <div className="mx-auto max-w-7xl px-4 pt-10">
                <h1 className="mb-4 text-3xl font-bold">
                    {query ? `Results for “${query}”` : "Search"}
                </h1>
                <SearchBar key={query} defaultValue={query} />
            </div>

            {query ? (
                <>
                    <ResultsRow
                        title="Movies"
                        query={query}
                        items={moviesQuery.data?.movies ?? []}
                        isLoading={moviesQuery.isLoading}
                        isError={moviesQuery.isError}
                        favorites={movieFavorites.favorites}
                        onToggleFavorite={movieFavorites.toggleFavorite}
                        getDetailsPath={(item) => `/movies/${item.id}`}
                    />
                    <ResultsRow
                        title="Series"
                        query={query}
                        items={seriesQuery.data?.movies ?? []}
                        isLoading={seriesQuery.isLoading}
                        isError={seriesQuery.isError}
                        favorites={seriesFavorites.favorites}
                        onToggleFavorite={seriesFavorites.toggleFavorite}
                        getDetailsPath={(item) => `/series/${item.id}`}
                    />
                </>
            ) : (
                <p className="mx-auto max-w-7xl px-4 py-10 text-muted">
                    Type a title above to search movies and series.
                </p>
            )}
        </div>
    );
}