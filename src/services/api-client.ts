import axios, { AxiosError } from "axios";

import { tokenStorage } from "@/utils/token-storage";

/**
 * Shared axios instance. All backend traffic goes through here so the
 * base URL and auth header logic exist exactly once.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const access = tokenStorage.getAccess();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

/**
 * Extract per-field messages from a DRF validation error response
 * ({"field": ["msg", ...]}) so forms can attach them to their inputs.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  if (error instanceof AxiosError && error.response?.status === 400) {
    const data: unknown = error.response.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      for (const [field, messages] of Object.entries(data)) {
        if (Array.isArray(messages) && typeof messages[0] === "string") {
          fieldErrors[field] = messages[0];
        } else if (typeof messages === "string") {
          fieldErrors[field] = messages;
        }
      }
    }
  }
  return fieldErrors;
}

/**
 * Extract a human-readable message from a DRF error response.
 * DRF errors come as {"detail": "..."} or {"field": ["msg", ...]}.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data: unknown = error.response?.data;
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      if (typeof record.detail === "string") return record.detail;
      const firstValue = Object.values(record)[0];
      if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
        return firstValue[0];
      }
    }
    if (error.code === "ERR_NETWORK") {
      return "Cannot reach the server. Please try again.";
    }
  }
  return fallback;
}
