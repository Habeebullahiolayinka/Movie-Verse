import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../component/navbar";
import { fetchSeriesById } from "../../api/movies";

export default function SeriesDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: show, isPending, isError } = useQuery({
        queryKey: ["series-detail", id],
        queryFn: () => fetchSeriesById(id as string),
        enabled: Boolean(id),
        retry: false,
    });

    function handleBack() {
        // history.state.idx is 0 on the first page of a session
        if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate("/series");
        }
    }

    return (
        <div className="min-h-screen bg-base text-ink">
            <Navbar />

            <div className="px-6 py-10 md:px-12">
                <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm font-medium text-accent-hover hover:underline"
                >
                    ← Back
                </button>

                {isPending ? (
                    <p role="status" className="mt-8 text-muted">
                        Loading series...
                    </p>
                ) : isError ? (
                    <div role="alert" className="mt-8">
                        <h1 className="text-2xl font-bold">Series not found</h1>
                        <p className="mt-2 text-muted">
                            We couldn't find that series. It may not exist, or
                            something went wrong.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-8 md:grid-cols-[300px_1fr]">
                        <img
                            src={show.poster_path}
                            alt={`${show.title} poster`}
                            className="aspect-[2/3] w-full rounded-xl border border-line object-cover"
                        />

                        <div>
                            <h1 className="text-4xl font-extrabold">{show.title}</h1>

                            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                                <span>{show.genre_ids}</span>
                                <span>{show.release_year || "—"}</span>
                                <span>★ {show.vote_avarage}</span>
                                <span>
                                    {show.seasons}{" "}
                                    {show.seasons === 1 ? "season" : "seasons"}
                                </span>
                            </div>

                            <p className="mt-6 max-w-2xl leading-7 text-muted">
                                {show.overview || "No description available."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}