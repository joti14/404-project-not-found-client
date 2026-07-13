"use client";

import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

import { TaskCard } from "./task-card";

interface DraggableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  disabled?: boolean;
}

/**
 * Drag behavior wrapped AROUND TaskCard, so the card itself stays
 * reusable and knows nothing about dnd-kit.
 */
export function DraggableTaskCard({ task, onEdit, disabled }: DraggableTaskCardProps) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: task.id,
    data: { task },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none",
        isDragging && "opacity-40",
        disabled && "cursor-default",
      )}
    >
      <TaskCard task={task} onEdit={onEdit} />
    </div>
  );
}
