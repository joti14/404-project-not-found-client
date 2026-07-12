"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";
import { tokenStorage } from "@/utils/token-storage";

/**
 * Full client-side teardown: tokens, auth state, and the query cache
 * (so no fetched data survives into another user's session).
 */
export function useLogout() {
  const clearUser = useAuthStore((state) => state.clearUser);
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    tokenStorage.clear();
    queryClient.clear();
    clearUser();
    router.replace("/login");
  };
}
