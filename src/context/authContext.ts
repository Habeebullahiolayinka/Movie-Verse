

import { createContext } from "react";

export type User = {
    email: string;
    name?: string;
};

export type AuthContextValue = {
    user: User | null;
    signIn: (user: User) => void;
    signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);