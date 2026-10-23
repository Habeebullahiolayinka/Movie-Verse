
import { useEffect, useState } from "react";

type HeroSlideshowProps = {
    images: string[];
    interval?: number;
};

export default function HeroSlideshow({
    images,
    interval = 5000,
}: HeroSlideshowProps) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (images.length < 2) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduceMotion) return;

        const timer = setInterval(() => {
            setActive((current) => (current + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    if (images.length === 0) return null;

    return (
        <div
            aria-hidden="true"
           className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ...`}
        >
            {images.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            {/* light fades only: left for text, bottom to blend into the page */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        </div>
    );
}