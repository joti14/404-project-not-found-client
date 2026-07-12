/**
 * Date helpers working in LOCAL time with ISO (YYYY-MM-DD) strings.
 * `Date.toISOString()` is deliberately avoided: it converts to UTC and
 * shifts the calendar day for anyone east of Greenwich after midnight.
 */

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

export function addDays(iso: string, amount: number): string {
  const date = fromIsoDate(iso);
  date.setDate(date.getDate() + amount);
  return toIsoDate(date);
}

/** e.g. "Saturday, July 12" */
export function formatDisplayDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(fromIsoDate(iso));
}
