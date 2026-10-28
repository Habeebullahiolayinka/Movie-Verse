export function readJson<T>(key: string, fallback: T): T {
    try {
        const saved = localStorage.getItem(key);
        return saved ? (JSON.parse(saved) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function writeJson(key: string, value: unknown): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        (e : string)=> console.log(e)
    }
}