import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ColumnProps {
  title: string;
  count: number;
  accentClassName: string;
  children?: ReactNode;
}

/**
 * Presentational Kanban column. Rendering of cards is injected via
 * children so this component never needs to know what a task is.
 */
export function Column({ title, count, accentClassName, children }: ColumnProps) {
  return (
    <section
      aria-label={title}
      className="flex min-h-96 flex-col rounded-xl border bg-muted/40"
    >
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <span
          className={cn("size-2.5 rounded-full", accentClassName)}
          aria-hidden
        />
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Inbox className="size-5" aria-hidden />
            <p className="text-xs">No tasks</p>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
