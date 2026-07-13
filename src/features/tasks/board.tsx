"use client";

import { CircleAlert, Plus, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DateSelector } from "@/components/ui/date-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { useDateStore } from "@/store/date-store";
import type { Task, TaskStatus } from "@/types/task";
import { formatDisplayDate } from "@/utils/date";

import { Column } from "./column";
import { TaskCard } from "./task-card";
import { TaskModal } from "./task-modal";
import { useTasks } from "./use-tasks";

const COLUMNS: ReadonlyArray<{
  status: TaskStatus;
  title: string;
  accent: string;
}> = [
  { status: "todo", title: "To Do", accent: "bg-sky-500" },
  { status: "in_progress", title: "In Progress", accent: "bg-amber-500" },
  { status: "done", title: "Done", accent: "bg-emerald-500" },
];

const EMPTY_GROUPS: Record<TaskStatus, Task[]> = {
  todo: [],
  in_progress: [],
  done: [],
};

/** The Kanban board for the globally selected date. */
export function Board() {
  const selectedDate = useDateStore((state) => state.selectedDate);
  const setSelectedDate = useDateStore((state) => state.setSelectedDate);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks, isPending, isError, refetch, isRefetching } =
    useTasks(selectedDate);

  const groups = useMemo(() => {
    if (!tasks) return EMPTY_GROUPS;
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    for (const task of tasks) {
      grouped[task.status].push(task);
    }
    return grouped;
  }, [tasks]);

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Task Board</h1>
          <p className="text-sm text-muted-foreground">
            {formatDisplayDate(selectedDate)}
            {tasks && ` · ${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateSelector value={selectedDate} onChange={setSelectedDate} />
          <Button onClick={openCreate}>
            <Plus className="size-4" aria-hidden />
            Add Task
          </Button>
        </div>
      </div>

      {isError ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-10 text-center"
        >
          <CircleAlert className="size-6 text-destructive" aria-hidden />
          <div>
            <p className="font-medium">Could not load tasks</p>
            <p className="text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RotateCw
              className={isRefetching ? "size-4 animate-spin" : "size-4"}
              aria-hidden
            />
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNS.map((column) =>
            isPending ? (
              <div
                key={column.status}
                className="flex min-h-96 flex-col gap-2 rounded-xl border bg-muted/40 p-3 pt-14"
                aria-busy="true"
              >
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <Column
                key={column.status}
                title={column.title}
                count={groups[column.status].length}
                accentClassName={column.accent}
              >
                {groups[column.status].map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={openEdit} />
                ))}
              </Column>
            ),
          )}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        task={editingTask}
        boardDate={selectedDate}
      />
    </div>
  );
}
