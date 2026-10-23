
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") return saved;
    } catch {
        // storage unavailable: fall through
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // ignore
        }
    }, [theme]);

    function toggleTheme() {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    }

    return { theme, toggleTheme };
}