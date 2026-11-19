import MovieCard from "./movieCard";
import SeriesCard from "./seriesCard";
import Reveal from "./reveal";
import { itemKey, type PassportItem } from "../types/passport";

type PassportCollectionProps = {
    items: PassportItem[];
    emptyMessage: string;
    onToggleFavorite: (item: PassportItem) => void;
    isFavorite: (item: PassportItem) => boolean;
};

export default function PassportCollection({
    items,
    emptyMessage,
    onToggleFavorite,
    isFavorite,
}: PassportCollectionProps) {
    if (items.length === 0) {
        return (
            <p className="rounded-xl border border-line bg-card p-8 text-center text-muted">
                {emptyMessage}
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item, index) => {
                const Card = item.kind === "movie" ? MovieCard : SeriesCard;
                return (
                    <Reveal key={itemKey(item)} delay={(index % 5) * 60}>
                        <Card
                            movie={item.media}
                            isFavorite={isFavorite(item)}
                            onToggleFavorite={() => onToggleFavorite(item)}
                        />
                    </Reveal>
                );
            })}
        </div>
    );
}