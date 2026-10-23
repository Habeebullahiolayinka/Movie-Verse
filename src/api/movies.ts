import type { Movie } from "../data/movie "

const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

function toBackdropUrl(path: string | null): string | undefined {
    return path ? `${BACKDROP_BASE}${path}` : undefined;
}

type TmdbMovie = {
    id: number;
    title: string;
    vote_average: number;
    release_date: string;
    poster_path: string | null;
    genre_ids: number[];
    backdrop_path : string | null
};

// CHANGED: added page and total_pages
type TmdbResponse = {
    page: number;
    total_pages: number;
    results: TmdbMovie[];
};

// CHANGED: new type, what fetchMovies now returns
export type MoviesPage = {
    movies: Movie[];
    page: number;
    totalPages: number;
};

export type MovieDetails = Movie & {
    overview: string;
    runtime: number | null;
};

type TmdbMovieDetails = {
    id: number;
    title: string;
    overview: string;
    runtime: number | null;
    vote_average: number;
    release_date: string;
    poster_path: string | null;
    genres: { id: number; name: string }[];
};

const genreNames: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    18: "Drama",
    10749: "Romance",
    878: "Sci-Fi",
};

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

async function tmdbGet<T>(path: string): Promise<T> {
    const token = import.meta.env.VITE_TMDB_TOKEN;

    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

function toMovie(item: TmdbMovie): Movie {
    return {
        id: item.id,
        title: item.title,
        genre_ids: genreNames[item.genre_ids[0]] ?? "Other",
        vote_avarage: Number(item.vote_average.toFixed(1)),
        release_year: Number(item.release_date.slice(0, 4)),
        poster_path: item.poster_path
            ? `${IMAGE_BASE}${item.poster_path}`
            : "/posters/placeholder.jpg",
        backdrop_path: toBackdropUrl(item.backdrop_path),
    };
}

// CHANGED: takes a page number, returns movies plus paging info
export async function fetchMovies(search: string, page: number): Promise<MoviesPage> {
    const query = search.trim();

    const path = query
        ? `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `/movie/popular?page=${page}`;

    const data = await tmdbGet<TmdbResponse>(path);

    return {
        movies: data.results.map(toMovie),
        page: data.page,
        totalPages: data.total_pages,
    };
}

export async function fetchMovieById(id: string): Promise<MovieDetails> {
    const item = await tmdbGet<TmdbMovieDetails>(`/movie/${id}`);

    return {
        id: item.id,
        title: item.title,
        genre_ids: item.genres[0]?.name ?? "Other",
        vote_avarage: Number(item.vote_average.toFixed(1)),
        release_year: Number(item.release_date.slice(0, 4)),
        poster_path: item.poster_path
            ? `${IMAGE_BASE}${item.poster_path}`
            : "/posters/placeholder.jpg",
        overview: item.overview,
        runtime: item.runtime,
    };
}


// SERIES ENDPOINT

type TmdbShow = {
    id: number;
    name: string;
    vote_average: number;
    first_air_date: string | null;
    poster_path: string | null;
    genre_ids: number[];
    backdrop_path: string | null
};

type TmdbShowsResponse = {
    page: number;
    total_pages: number;
    results: TmdbShow[];
};

// TV genres differ from movie genres (verify against TMDB's TV genre list)
const tvGenreNames: Record<number, string> = {
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    9648: "Mystery",
    10765: "Sci-Fi & Fantasy",
    37: "Western",
};

function toSeries(item: TmdbShow): Movie {
    return {
        id: item.id,
        title: item.name,
        genre_ids: tvGenreNames[item.genre_ids[0]] ?? "Other",
        vote_avarage: Number(item.vote_average.toFixed(1)),
        release_year: Number((item.first_air_date ?? "").slice(0, 4)),
        poster_path: item.poster_path
            ? `${IMAGE_BASE}${item.poster_path}`
            : "/posters/placeholder.jpg",
    };
}

export async function fetchSeries(search: string, page: number): Promise<MoviesPage> {
    const token = import.meta.env.VITE_TMDB_TOKEN;
    const query = search.trim();

    const url = query
        ? `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&page=${page}`
        : `https://api.themoviedb.org/3/tv/popular?page=${page}`;

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data: TmdbShowsResponse = await response.json();

    return {
        movies: data.results.map(toSeries),
        page: data.page,
        totalPages: data.total_pages,
    };
}

export type SeriesDetails = Movie & {
    overview: string;
    seasons: number;
};

type TmdbShowDetails = {
    id: number;
    name: string;
    overview: string;
    number_of_seasons: number;
    vote_average: number;
    first_air_date: string | null;
    poster_path: string | null;
    genres: { id: number; name: string }[];
};

export async function fetchSeriesById(id: string): Promise<SeriesDetails> {
    const token = import.meta.env.VITE_TMDB_TOKEN;

    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const item: TmdbShowDetails = await response.json();

    return {
        id: item.id,
        title: item.name,
        genre_ids: item.genres[0]?.name ?? "Other",
        vote_avarage: Number(item.vote_average.toFixed(1)),
        release_year: Number((item.first_air_date ?? "").slice(0, 4)),
        poster_path: item.poster_path
            ? `${IMAGE_BASE}${item.poster_path}`
            : "/posters/placeholder.jpg",
        overview: item.overview,
        seasons: item.number_of_seasons,
    };
}