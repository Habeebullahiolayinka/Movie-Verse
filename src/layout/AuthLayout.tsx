import type { ReactNode } from "react";
import hero from "../assets/venus-major-LtDKx9ICQuI-unsplash.jpg"

type AuthLayoutProps = {
  children: ReactNode;
};

const benefits = [
  "High Quality Streaming",
  "Personalized Recommendations",
  "Watch Anywhere on Any Device",
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] bg-base font-sans text-ink lg:grid-cols-[45%_55%] lg:grid-rows-1">
      <aside className="relative isolate flex min-h-[12rem] flex-col justify-between overflow-hidden p-6 md:min-h-[16rem] md:p-8 lg:min-h-screen xl:p-12">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-base via-base/70 to-base/30" />

        <header>
          <span className="text-xl font-bold tracking-tight md:text-2xl">
            Movie<span className="text-accent">Verse</span>
          </span>
        </header>

        <div>
          <p className="text-2xl font-bold leading-[1.1] tracking-tight md:text-4xl xl:text-5xl">
            Unlimited Movies,
            <br />
            <span className="text-accent">Endless Emotions</span>
          </p>

          <p className="mt-5 hidden max-w-sm text-base text-muted md:block">
            Stream the best movies, TV shows and original content — all in one place.
          </p>

          <ul className="mt-8 hidden space-y-4 lg:block">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm font-medium">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-xs text-accent"
                >
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:block" />
      </aside>

      <main className="flex items-start justify-center px-5 py-8 sm:px-8 md:items-center md:py-12 lg:border-l lg:border-line lg:p-6">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
}