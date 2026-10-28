import { useSearchParams } from "react-router-dom";
import { PASSPORT_TABS, type PassportTab } from "../types/passport";

function isPassportTab(value: string | null): value is PassportTab {
    return PASSPORT_TABS.some((tab) => tab.id === value);
}

export function usePassportTab() {
    const [params, setParams] = useSearchParams();
    const raw = params.get("tab");

    const tab: PassportTab = isPassportTab(raw) ? raw : "overview";

    function setTab(next: PassportTab) {
        setParams({ tab: next }, { replace: true });
    }

    return { tab, setTab };
}