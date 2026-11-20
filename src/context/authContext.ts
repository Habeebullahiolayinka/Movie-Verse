

import { createContext } from "react";

export type User = {
    id?: string;
    email: string;
    name?: string;
    avatar? : string
};

export type AuthContextValue = {
    user: User | null;
    loading: boolean;
    signIn: (user: User) => void;
    signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);