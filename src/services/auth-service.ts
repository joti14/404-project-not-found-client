import { apiClient } from "@/services/api-client";
import type { AuthUser, TokenPair } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<TokenPair> {
    const { data } = await apiClient.post<TokenPair>("/api/auth/login/", payload);
    return data;
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>("/api/auth/me/");
    return data;
  },
};
