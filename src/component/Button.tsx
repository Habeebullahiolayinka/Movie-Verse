

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "social";
};

const base =
  "flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold " +
  "transition duration-200 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover active:scale-[0.98]",
  social: "border border-line bg-card text-ink hover:border-muted active:scale-[0.98]",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}