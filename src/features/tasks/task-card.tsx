import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types/task";

const PRIORITY_STYLES: Record<TaskPriority, { label: string; className: string }> = {
  high: {
    label: "High",
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  low: {
    label: "Low",
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
};

/** Presentational Kanban card for a single task. */
export function TaskCard({ task }: { task: Task }) {
  const priority = PRIORITY_STYLES[task.priority];

  return (
    <article className="rounded-lg border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
        <Badge
          variant="outline"
          className={cn("shrink-0 text-[11px]", priority.className)}
        >
          {priority.label}
        </Badge>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
          {task.description}
        </p>
      )}

      {task.tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1" aria-label="Tags">
          {task.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
