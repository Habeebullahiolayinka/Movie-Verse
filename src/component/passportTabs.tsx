import { useRef, type KeyboardEvent } from "react";
import { PASSPORT_TABS, type PassportTab } from "../types/passport";

type PassportTabsProps = {
    active: PassportTab;
    onChange: (tab: PassportTab) => void;
};

export default function PassportTabs({ active, onChange }: PassportTabsProps) {
    const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

    function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        const last = PASSPORT_TABS.length - 1;
        let next: number;

        if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
        else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = last;
        else return;

        event.preventDefault();
        const nextTab = PASSPORT_TABS[next].id;
        onChange(nextTab);
        buttons.current[nextTab]?.focus();
    }

    return (
        <div
            role="tablist"
            aria-label="Passport sections"
            className="flex gap-2 overflow-x-auto border-b border-line"
        >
            {PASSPORT_TABS.map((tab, index) => {
                const selected = tab.id === active;
                return (
                    <button
                        key={tab.id}
                        ref={(element) => {
                            buttons.current[tab.id] = element;
                        }}
                        type="button"
                        role="tab"
                        id={`passport-tab-${tab.id}`}
                        aria-selected={selected}
                        aria-controls={`passport-panel-${tab.id}`}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => onChange(tab.id)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className={
                            "shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition " +
                            (selected
                                ? "border-accent text-accent-hover"
                                : "border-transparent text-muted hover:text-ink")
                        }
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}