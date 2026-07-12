import { create } from "zustand";

import type { AuthUser } from "@/types/auth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/**
 * Client-side auth state. Deliberately dumb: it holds the current user,
 * it never fetches. Fetching is the job of feature hooks + services.
 *
 * `status` starts as "loading" so guards show a spinner (not a redirect)
 * until AuthProvider has finished restoring the session.
 */
interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  setUser: (user) => set({ user, status: "authenticated" }),
  clearUser: () => set({ user: null, status: "unauthenticated" }),
}));
