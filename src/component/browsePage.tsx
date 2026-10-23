import { useState, type ChangeEvent, type ComponentType, type FormEvent } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Navbar from "./navbar";
import Reveal from "./reveal";
import { useFavorites } from "../hooks/useFavorites";
import { useRequireAuth } from "../hooks/useRequiredAuth";
import type { Movie } from "../data/movie ";

type CardProps = {
    movie: Movie;
    isFavorite: boolean;
    onToggleFavorite: () => void;
};

type PageResult = {
    movies: Movie[];
    page: number;
    totalPages: number;
};

type BrowsePageProps = {
    title: string;
    description: string;
    noun: string; 
    queryKey: string; 
    favoritesKey: string; 
    fetchPage: (search: string, page: number) => Promise<PageResult>;
    Card: ComponentType<CardProps>;
};

export default function BrowsePage({
    title,
    description,
    noun,
    queryKey,
    favoritesKey,
    fetchPage,
    Card,
}: BrowsePageProps) {
    const [inputValue, setInputValue] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [sortBy, setSortBy] = useState("default");
    const [showFavorites, setShowFavorites] = useState(false);

    const { favorites, toggleFavorite } = useFavorites(favoritesKey);
    const { user, requireAuth } = useRequireAuth();

    const {
        data,
        isPending,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: [queryKey, appliedSearch.trim()],
        queryFn: ({ pageParam }) => fetchPage(appliedSearch, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    });

    const allItems: Movie[] = data?.pages.flatMap((page) => page.movies) ?? [];
    const items: Movie[] = [...new Map(allItems.map((item) => [item.id, item])).values()];

    // signed-out visitors see no favorites (they are stored per browser, not per account)
    const visibleFavorites = user ? favorites : [];
    const sourceItems: Movie[] = showFavorites ? visibleFavorites : items;

    const genres = ["All", ...new Set(sourceItems.map((item) => item.genre_ids))];

    const filteredItems = sourceItems.filter(
        (item) => selectedGenre === "All" || item.genre_ids === selectedGenre
    );

    const sortedItems: Movie[] = [...filteredItems];

    switch (sortBy) {
        case "rating-desc":
            sortedItems.sort((a, b) => b.vote_avarage - a.vote_avarage);
            break;
        case "rating-asc":
            sortedItems.sort((a, b) => a.vote_avarage - b.vote_avarage);
            break;
        case "year-desc":
            sortedItems.sort((a, b) => b.release_year - a.release_year);
            break;
        case "year-asc":
            sortedItems.sort((a, b) => a.release_year - b.release_year);
            break;
    }

    function handleSearchInput(event: ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
    }

    function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setAppliedSearch(inputValue);
    }

    const gridClass =
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5";

    return (
        <div className="min-h-screen bg-base text-ink">
            <Navbar />

            <main className="px-6 py-10 md:px-12">
                <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
                <p className="mt-2 text-muted">{description}</p>

                {/* Controls */}
                <div className="mt-8 flex flex-col gap-4">
                    <form
                        role="search"
                        className="flex w-full gap-2 md:max-w-md"
                        onSubmit={handleSearchSubmit}
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleSearchInput}
                            placeholder={`Search ${noun}...`}
                            aria-label={`Search ${noun}`}
                            className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <button
                                key={genre}
                                type="button"
                                onClick={() => setSelectedGenre(genre)}
                                aria-pressed={selectedGenre === genre}
                                className={
                                    "rounded-full border px-4 py-2 text-sm transition " +
                                    (selectedGenre === genre
                                        ? "border-accent bg-accent text-white"
                                        : "border-line text-muted hover:text-ink")
                                }
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            aria-label={`Sort ${noun}`}
                            className="rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                        >
                            <option value="default">Default</option>
                            <option value="rating-desc">Highest rating</option>
                            <option value="rating-asc">Lowest rating</option>
                            <option value="year-desc">Newest</option>
                            <option value="year-asc">Oldest</option>
                        </select>

                        <button
                            type="button"
                            onClick={() =>
                                requireAuth(() => setShowFavorites((current) => !current))
                            }
                            aria-pressed={showFavorites}
                            className={
                                "rounded-lg border px-4 py-2 text-sm transition " +
                                (showFavorites
                                    ? "border-accent bg-accent text-white"
                                    : "border-line text-muted hover:text-ink")
                            }
                        >
                            ♥ Favorites ({visibleFavorites.length})
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="mt-8">
                    {isPending ? (
                        <div role="status" className={gridClass}>
                            <span className="sr-only">Loading {noun}...</span>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div
                                    key={index}
                                    aria-hidden="true"
                                    className="rounded-xl border border-line bg-card p-3 md:p-4"
                                >
                                    <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-line" />
                                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-line" />
                                    <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-line" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div role="alert" className="flex flex-col items-start gap-3">
                            <p>Couldn't load {noun}. Please try again.</p>
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
                            >
                                Retry
                            </button>
                        </div>
                    ) : sortedItems.length > 0 ? (
                        <div className={gridClass}>
                            {sortedItems.map((item, index) => (
                                <Reveal key={item.id} delay={(index % 5) * 60}>
                                    <Card
                                        movie={item}
                                        isFavorite={visibleFavorites.some(
                                            (fav) => fav.id === item.id
                                        )}
                                        onToggleFavorite={() =>
                                            requireAuth(() => toggleFavorite(item))
                                        }
                                    />
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-line bg-card p-8 text-center text-muted">
                            {showFavorites
                                ? "You haven't added any favorites yet."
                                : `No ${noun} found. Try a different search or genre.`}
                        </p>
                    )}

                    {!isPending && !isError && !showFavorites && hasNextPage && (
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="rounded-lg border border-line px-6 py-3 font-semibold transition hover:bg-card disabled:opacity-60"
                            >
                                {isFetchingNextPage ? "Loading..." : "Show More"}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}