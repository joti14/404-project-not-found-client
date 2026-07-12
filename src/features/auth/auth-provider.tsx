"use client";

import { useEffect, type ReactNode } from "react";

import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { tokenStorage } from "@/utils/token-storage";

/**
 * Restores the session once on app boot: if a stored token exists,
 * GET /me both validates it and returns the profile. Runs exactly once;
 * everything else just reads the auth store.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    if (!tokenStorage.getAccess()) {
      clearUser();
      return;
    }

    let cancelled = false;
    authService
      .getMe()
      .then((user) => {
        if (!cancelled) setUser(user);
      })
      .catch(() => {
        if (!cancelled) {
          tokenStorage.clear();
          clearUser();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [setUser, clearUser]);

  return <>{children}</>;
}
