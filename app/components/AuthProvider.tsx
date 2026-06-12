import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearStoredUser,
  fetchCurrentUser,
  getStoredUser,
  setStoredUser,
  signOut,
} from "~/lib/auth";
import type { AuthResponse, User } from "~/types/auth";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Show cached user instantly to avoid UI flash, then verify with /auth/me
    const cached = getStoredUser();
    if (cached) setUser(cached);

    fetchCurrentUser().then((freshUser) => {
      if (freshUser) {
        setStoredUser(freshUser);
        setUser(freshUser);
      } else {
        clearStoredUser();
        setUser(null);
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearStoredUser();
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback((response: AuthResponse) => {
    setStoredUser(response.user);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    signOut(); // clears server cookie; fire-and-forget
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isReady, login, logout }),
    [user, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
