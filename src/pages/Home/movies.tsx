import BrowsePage from "../../component/browsePage";
import MovieCard from "../../component/movieCard";
import { fetchMovies } from "../../api/movies";

export default function Movies() {
    return (
        <BrowsePage
            title="Movies"
            description="Search, filter and sort the full catalog."
            noun="movies"
            queryKey="movies"
            favoritesKey="favorites"
            fetchPage={fetchMovies}
            Card={MovieCard}
        />
    );
}