"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

import type { TaskStatus } from "@/types/task";

import { Column } from "./column";

interface DroppableColumnProps {
  status: TaskStatus;
  title: string;
  count: number;
  accentClassName: string;
  children?: ReactNode;
}

/**
 * Drop behavior wrapped around the presentational Column. The droppable
 * id IS the column's status - dropping resolves to a status change with
 * no extra mapping.
 */
export function DroppableColumn({
  status,
  title,
  count,
  accentClassName,
  children,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="flex min-h-96 flex-col">
      <Column
        title={title}
        count={count}
        accentClassName={accentClassName}
        isDropTarget={isOver}
      >
        {children}
      </Column>
    </div>
  );
}
