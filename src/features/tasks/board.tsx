"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CircleAlert, Plus, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DateSelector } from "@/components/ui/date-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { useDateStore } from "@/store/date-store";
import type { Task, TaskStatus } from "@/types/task";
import { formatDisplayDate } from "@/utils/date";

import { DraggableTaskCard } from "./draggable-task-card";
import { DroppableColumn } from "./droppable-column";
import { TaskCard } from "./task-card";
import { TaskModal } from "./task-modal";
import { useTasks } from "./use-tasks";
import { useUpdateTaskStatus } from "./use-update-task-status";

const COLUMNS: ReadonlyArray<{
  status: TaskStatus;
  title: string;
  accent: string;
}> = [
  { status: "todo", title: "To Do", accent: "bg-sky-500" },
  { status: "in_progress", title: "In Progress", accent: "bg-amber-500" },
  { status: "done", title: "Done", accent: "bg-emerald-500" },
];

const COLUMN_STATUSES: ReadonlySet<string> = new Set(
  COLUMNS.map((column) => column.status),
);

const EMPTY_GROUPS: Record<TaskStatus, Task[]> = {
  todo: [],
  in_progress: [],
  done: [],
};

/** The Kanban board for the globally selected date. Owns all task data. */
export function Board() {
  const selectedDate = useDateStore((state) => state.selectedDate);
  const setSelectedDate = useDateStore((state) => state.setSelectedDate);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { data: tasks, isPending, isError, refetch, isRefetching } =
    useTasks(selectedDate);
  const updateStatus = useUpdateTaskStatus();

  // 8px of movement before a drag starts, so plain clicks (edit/delete
  // buttons, links) on the card never turn into accidental drags.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask((event.active.data.current?.task as Task) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const task = event.active.data.current?.task as Task | undefined;
    const target = event.over?.id;

    if (
      !task ||
      typeof target !== "string" ||
      !COLUMN_STATUSES.has(target) ||
      target === task.status
    ) {
      return;
    }

    updateStatus.mutate({
      id: task.id,
      status: target as TaskStatus,
      dueDate: selectedDate,
    });
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTask(null)}
        >
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
                <DroppableColumn
                  key={column.status}
                  status={column.status}
                  title={column.title}
                  count={groups[column.status].length}
                  accentClassName={column.accent}
                >
                  {groups[column.status].map((task) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEdit}
                      disabled={updateStatus.isPending}
                    />
                  ))}
                </DroppableColumn>
              ),
            )}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeTask && (
              <div className="rotate-2 cursor-grabbing">
                <TaskCard task={activeTask} onEdit={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
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
