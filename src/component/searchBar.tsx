

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type SearchBarProps = {
    defaultValue?: string;
};

export default function SearchBar({ defaultValue = "" }: SearchBarProps) {
    const [text, setText] = useState(defaultValue);
    const navigate = useNavigate();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const query = text.trim();
        if (!query) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className="flex w-full max-w-xl gap-2"
        >
            <label htmlFor="global-search" className="sr-only">
                Search movies and series
            </label>
            <input
                id="global-search"
                type="search"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Search movies and series..."
                className="min-w-0 flex-1 rounded-md border border-line bg-surface/90 px-4 py-3 text-ink placeholder:text-muted"
            />
            <button
                type="submit"
                className="rounded-md bg-accent px-5 py-3 font-semibold text-white transition hover:bg-accent-hover"
            >
                Search
            </button>
        </form>
    );
}