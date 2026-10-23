import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./themeToggle";
import { useAuth } from "../hooks/useAuth";

type NavbarProps = {
    transparent?: boolean;
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-accent" : "transition hover:text-accent";

export default function Navbar({ transparent = false }: NavbarProps) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuth();

    const menuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
                menuButtonRef.current?.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    function handleSignOut() {
        setIsOpen(false);
        signOut();
    }

    function goToSignIn() {
        setIsOpen(false);
        navigate("/login");
    }

    return (
        <header
            className={`relative z-20 ${
                transparent ? "bg-transparent" : "border-b border-line bg-base"
            }`}
        >
            <nav className="flex items-center justify-between px-6 py-5 md:px-12">
                <Link to="/" className="text-2xl font-bold">
                    Movie <span className="text-accent">Verse</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden items-center gap-6 text-sm text-muted md:flex">
                    <NavLink to="/" end className={linkClass}>Home</NavLink>
                    <NavLink to="/movies" className={linkClass}>Movies</NavLink>
                    <NavLink to="/series" className={linkClass}>Series</NavLink>
                    {user && (
                        <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {/* Auth: desktop only, the mobile menu has its own */}
                    <div className="hidden items-center gap-3 md:flex">
                        {user ? (
                            <>
                                <span className="max-w-[180px] truncate text-sm text-ink">
                                    {user.name ?? user.email}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-card"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={goToSignIn}
                                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Hamburger: phones only */}
                    <button
                        type="button"
                        ref={menuButtonRef}
                        onClick={() => setIsOpen((current) => !current)}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className="rounded-lg border border-line p-2 text-lg md:hidden"
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>
                </div>
            </nav>

            {/* Mobile menu: solid background so it never floats over the photo */}
            {isOpen && (
                <div
                    id="mobile-menu"
                    className="absolute inset-x-0 top-full flex flex-col gap-4 border-b border-t border-line bg-base px-6 py-4 text-muted md:hidden"
                >
                    <NavLink to="/" end className={linkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
                    <NavLink to="/movies" className={linkClass} onClick={() => setIsOpen(false)}>Movies</NavLink>
                    <NavLink to="/series" className={linkClass} onClick={() => setIsOpen(false)}>Series</NavLink>
                    {user && (
                        <NavLink to="/favorites" className={linkClass} onClick={() => setIsOpen(false)}>Favorites</NavLink>
                    )}

                    {user ? (
                        <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
                            <span className="truncate text-sm text-ink">
                                {user.name ?? user.email}
                            </span>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-card"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={goToSignIn}
                            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}