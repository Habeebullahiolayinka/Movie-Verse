import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduceMotion || !("IntersectionObserver" in window)) {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return { ref, inView };
}