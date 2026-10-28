import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Navbar from "../../component/navbar";
import { fetchMovieById } from "../../api/movies";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";
import WatchActions from "../../component/watchActions";


export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate()
    

    const { data: movie, isPending, isError } = useQuery({
        queryKey: ["movie", id],
        queryFn: () => fetchMovieById(id as string),
        enabled: Boolean(id),
        retry: false,
    });

    const { addRecent } = useRecentlyViewed();

    useEffect(() => {
        if (!movie) return;

        addRecent({
            id: movie.id,
            title: movie.title,
            genre_ids: movie.genre_ids,
            vote_avarage: movie.vote_avarage,
            release_year: movie.release_year,
            poster_path: movie.poster_path,
        });
    }, [movie, addRecent]);

    return (
        <div className="min-h-screen bg-base text-ink">
            <Navbar />

            <div className="px-6 py-10 md:px-12">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-sm font-medium text-accent-hover hover:underline"
                >
                    ← Back
                </button>

                {isPending ? (
                    <p role="status" className="mt-8 text-muted">
                        Loading movie...
                    </p>
                ) : isError ? (
                    <div role="alert" className="mt-8">
                        <h1 className="text-2xl font-bold">Movie not found</h1>
                        <p className="mt-2 text-muted">
                            We couldn't find that movie. It may not exist, or
                            something went wrong.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-8 md:grid-cols-[300px_1fr]">
                        <img
                            src={movie.poster_path}
                            alt={`${movie.title} poster`}
                            className="aspect-[2/3] w-full rounded-xl border border-line object-cover"
                        />

                        <div>
                            <h1 className="text-4xl font-extrabold">{movie.title}</h1>

                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                                <span>{movie.genre_ids}</span>
                                <span>{movie.release_year}</span>
                                <span>★ {movie.vote_avarage}</span>
                                {movie.runtime ? <span>{movie.runtime} min</span> : null}
                            </div>

                            <p className="mt-6 max-w-2xl leading-7 text-muted">
                                {movie.overview || "No description available."}
                            </p>

                            <WatchActions movie={movie} kind="movie" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}