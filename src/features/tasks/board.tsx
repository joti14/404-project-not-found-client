"use client";

import { DateSelector } from "@/components/ui/date-selector";
import { useDateStore } from "@/store/date-store";
import { formatDisplayDate } from "@/utils/date";

import { Column } from "./column";

const COLUMNS = [
  { status: "todo", title: "To Do", accent: "bg-sky-500" },
  { status: "in_progress", title: "In Progress", accent: "bg-amber-500" },
  { status: "done", title: "Done", accent: "bg-emerald-500" },
] as const;

/**
 * The Kanban board for the globally selected date. Task fetching lands
 * in the next slice; for now every column renders its empty state.
 */
export function Board() {
  const selectedDate = useDateStore((state) => state.selectedDate);
  const setSelectedDate = useDateStore((state) => state.setSelectedDate);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Task Board</h1>
          <p className="text-sm text-muted-foreground">
            {formatDisplayDate(selectedDate)}
          </p>
        </div>
        <DateSelector value={selectedDate} onChange={setSelectedDate} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <Column
            key={column.status}
            title={column.title}
            count={0}
            accentClassName={column.accent}
          />
        ))}
      </div>
    </div>
  );
}
