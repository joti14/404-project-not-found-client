import type { TokenPair } from "@/types/auth";

/**
 * The single place that knows where JWT tokens live (localStorage).
 * Guarded so it is safe to import from code that also runs on the server,
 * where `window` does not exist.
 */

const ACCESS_KEY = "pnf_access_token";
const REFRESH_KEY = "pnf_refresh_token";

const isBrowser = () => typeof window !== "undefined";

export const tokenStorage = {
  getAccess(): string | null {
    return isBrowser() ? window.localStorage.getItem(ACCESS_KEY) : null;
  },
  getRefresh(): string | null {
    return isBrowser() ? window.localStorage.getItem(REFRESH_KEY) : null;
  },
  set(tokens: TokenPair): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(ACCESS_KEY, tokens.access);
    window.localStorage.setItem(REFRESH_KEY, tokens.refresh);
  },
  clear(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};
