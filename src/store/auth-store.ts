import { create } from "zustand";

import type { AuthUser } from "@/types/auth";

/**
 * Client-side auth state. Deliberately dumb: it holds the current user,
 * it never fetches. Fetching is the job of feature hooks + services.
 */
interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
