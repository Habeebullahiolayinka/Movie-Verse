import type {ReactNode} from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../data/movie ";
import Reveal from "./reveal";


type TrendingSectionProps = {
    title: string;
    linkTo: string;
    linkLabel: string;
    items: Movie[];
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    renderCard: (item: Movie) => ReactNode;
};

export function TrendingSection({
    title,
    linkTo,
    linkLabel,
    items,
    isLoading,
    isError,
    onRetry,
    renderCard,
}: TrendingSectionProps) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-ink">{title}</h2>
                <Link
                    to={linkTo}
                    className="text-sm font-medium text-accent-hover hover:underline"
                >
                    {linkLabel} →
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-[2/3] animate-pulse rounded-lg bg-card"
                        />
                    ))}
                </div>
            ) : isError ? (
                <div className="rounded-lg border border-line bg-surface p-6 text-center">
                    <p className="mb-4 text-danger">Could not load {title.toLowerCase()}.</p>
                    <button
                        type="button"
                        onClick={() => onRetry()}
                        className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((item, index) => (
                        <Reveal key={item.id} delay={(index % 4) * 80}>
                            {renderCard(item)}
                        </Reveal>
                    ))}
                </div>
            )}

            {!isLoading && !isError && items.length > 0 && (
                <div className="mt-8 text-center">
                    <Link
                        to={linkTo}
                        className="inline-block rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
                    >
                        {linkLabel}
                    </Link>
                </div>
            )}
        </section>
    );
}