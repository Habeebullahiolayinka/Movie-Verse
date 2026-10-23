import BrowsePage from "../../component/browsePage";
import SeriesCard from "../../component/seriesCard";
import { fetchSeries } from "../../api/movies";

export default function Series() {
    return (
        <BrowsePage
            title="Series"
            description="Search, filter and sort the full catalog."
            noun="series"
            queryKey="series"
            favoritesKey="favorites-series"
            fetchPage={fetchSeries}
            Card={SeriesCard}
        />
    );
}