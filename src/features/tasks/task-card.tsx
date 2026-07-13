"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types/task";

import { useDeleteTask } from "./use-delete-task";

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

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

/** Kanban card with hover-revealed edit/delete actions. */
export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const deleteTask = useDeleteTask();
  const priority = PRIORITY_STYLES[task.priority];

  const handleDelete = () => {
    deleteTask.mutate(
      { id: task.id, dueDate: task.due_date },
      { onSuccess: () => setConfirmingDelete(false) },
    );
  };

  return (
    <article className="group rounded-lg border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm">
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

      <div className="mt-2 flex justify-end gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit "${task.title}"`}
          onClick={() => onEdit(task)}
        >
          <Pencil className="size-3.5" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete "${task.title}"`}
          className="text-destructive hover:text-destructive"
          onClick={() => setConfirmingDelete(true)}
        >
          <Trash2 className="size-3.5" aria-hidden />
        </Button>
      </div>

      <AlertDialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              “{task.title}” will be permanently removed. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTask.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
