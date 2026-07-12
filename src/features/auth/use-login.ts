"use client";

import { useMutation } from "@tanstack/react-query";

import { authService, type LoginPayload } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { tokenStorage } from "@/utils/token-storage";

/**
 * Login orchestration: exchange credentials for tokens, persist them,
 * then fetch the profile so the app knows who is logged in.
 */
export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const tokens = await authService.login(payload);
      tokenStorage.set(tokens);
      return authService.getMe();
    },
    onSuccess: (user) => setUser(user),
    onError: () => tokenStorage.clear(),
  });
}
