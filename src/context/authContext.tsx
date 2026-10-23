import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./authContext";

const STORAGE_KEY = "auth-user";

function getStoredUser(): User | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? (JSON.parse(saved) as User) : null;
    } catch {
        return null;
    }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getStoredUser);

    function signIn(nextUser: User) {
        setUser(nextUser);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        } catch {
            // storage unavailable: user stays signed in for this session only
        }
    }

    function signOut() {
        setUser(null);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // ignore
        }
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}