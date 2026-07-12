import { create } from "zustand";

/**
 * Placeholder store establishing the Zustand conventions for this project:
 * a typed State + Actions interface and a single `create` call per domain.
 * Real stores (auth, selected date) will follow this exact shape.
 */
interface AppState {
  appName: string;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  appName: "404 Project Not Found",
  hydrated: false,
  setHydrated: (value) => set({ hydrated: value }),
}));
