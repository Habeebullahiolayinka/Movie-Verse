import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./authContext";
import { getMe, logout } from "../api/auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        const u = res.data.user;
        setUser({ id: u.id, email: u.email, name: u.fullName, avatar: u.avatar });
      }) 
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function signIn(nextUser: User) {
    setUser(nextUser);
  }

  async function signOut() {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}