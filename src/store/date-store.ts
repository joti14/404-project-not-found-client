import { create } from "zustand";

import { todayIso } from "@/utils/date";

/**
 * The globally selected board date, kept as a local-time ISO string
 * (YYYY-MM-DD) so it is serializable and timezone-safe.
 *
 * DateSelector writes it; task components read it. Neither knows the
 * other exists - this store is the only coupling point.
 */
interface DateState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useDateStore = create<DateState>((set) => ({
  selectedDate: todayIso(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
