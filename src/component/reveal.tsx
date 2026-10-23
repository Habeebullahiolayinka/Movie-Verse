import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type RevealProps = {
    children: ReactNode;
    delay?: number;
    className?: string;
};

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
    const { ref, inView } = useInView<HTMLDivElement>();

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition duration-700 ease-out ${
                inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            } ${className}`}
        >
            {children}
        </div>
    );
}