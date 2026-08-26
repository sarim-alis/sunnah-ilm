"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type AppMode } from "@/lib/mode";
import {
  deleteAccount as deleteAccountRequest,
  getProfile,
  login as loginRequest,
  logout as logoutRequest,
  readCachedUser,
  updateProfile as updateProfileRequest,
  type AuthUser,
} from "@/services/auth";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (input: {
    name: string;
    email: string;
    mode?: AppMode;
    image?: File | null;
  }) => Promise<AuthUser>;
  deleteAccount: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function applyMode(mode: AppMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cached = readCachedUser();
    if (cached?.role === "admin") {
      setUser(cached);
      applyMode(cached.mode);
    } else {
      applyMode("light");
    }
    setReady(true);

    if (!cached || cached.role !== "admin") return;
    void getProfile()
      .then((next) => {
        setUser(next);
        applyMode(next.mode);
      })
      .catch(() => {
        setUser(null);
        applyMode("light");
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    setUser(data.user);
    applyMode(data.user.mode);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    applyMode("light");
  }, []);

  const refresh = useCallback(async () => {
    const next = await getProfile();
    setUser(next);
    applyMode(next.mode);
  }, []);

  const updateProfile = useCallback(async (input: {
    name: string;
    email: string;
    mode?: AppMode;
    image?: File | null;
  }) => {
    const next = await updateProfileRequest(input);
    setUser(next);
    applyMode(next.mode);
    return next;
  }, []);

  const deleteAccount = useCallback(async () => {
    await deleteAccountRequest();
    setUser(null);
    applyMode("light");
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      logout,
      refresh,
      updateProfile,
      deleteAccount,
      setUser,
    }),
    [user, ready, login, logout, refresh, updateProfile, deleteAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useToggleMode() {
  const { user, setUser, updateProfile } = useAuth();

  return async () => {
    if (!user) return;
    const next = user.mode === "dark" ? "light" : "dark";
    setUser({ ...user, mode: next });
    applyMode(next);
    try {
      await updateProfile({ name: user.name, email: user.email, mode: next });
    } catch {
      setUser(user);
      applyMode(user.mode);
      throw new Error("Could not update theme");
    }
  };
}
