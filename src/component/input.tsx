import { useState } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: string;
    error?: string
};

export default function Input({
    label,
    id,
    type = "text",
    error = "",
    className = "",
    ...props
}: InputProps) {
    const [isVisible, setIsVisible] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && isVisible ? "text" : type;
    const hasError = error !== "";
    const errorId = `${id}-error`;

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-ink">
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={inputType}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    className={
                        "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink " +
                        "placeholder:text-muted/60 transition duration-200 " +
                        "hover:border-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 " +
                        (isPassword ? "pr-12 " : "") +
                        className
                    }
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setIsVisible((current) => !current)}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        aria-pressed={isVisible}
                        className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-4 text-muted transition duration-200 hover:text-ink focus-visible:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>

            {hasError && (
                <p id={errorId} role="alert" className="flex items-center gap-2 text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}

function EyeIcon() {
    return (
        <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <path d="m2 2 20 20" />
        </svg>
    );
}