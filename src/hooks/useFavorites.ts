

import { useEffect, useState } from "react";
import type { Movie } from "../data/movie ";

export function useFavorites(storageKey = "favorites") {
    const [favorites, setFavorites] = useState<Movie[]>(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(favorites));
    }, [favorites]);

    function toggleFavorite(movie: Movie) {
        setFavorites((current) =>
            current.some((fav) => fav.id === movie.id)
                ? current.filter((fav) => fav.id !== movie.id)
                : [...current, movie]
        );
    }

    return { favorites, toggleFavorite };
}