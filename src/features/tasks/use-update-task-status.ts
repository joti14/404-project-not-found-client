"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { taskService } from "@/services/task-service";
import type { Task, TaskStatus } from "@/types/task";

import { taskKeys } from "./use-tasks";

interface UpdateStatusVariables {
  id: number;
  status: TaskStatus;
  /** The board day the task lives on - the cache entry to patch. */
  dueDate: string;
}

/**
 * Optimistic status change for drag & drop:
 *  - onMutate: snapshot the day's cache and apply the move immediately
 *  - onError: restore the snapshot (automatic rollback)
 *  - on success: nothing - the optimistic state already equals the
 *    server state (only `status` changed), so a refetch would be waste.
 */
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateStatusVariables) =>
      taskService.updateTask(id, { status }),

    onMutate: async ({ id, status, dueDate }) => {
      const queryKey = taskKeys.byDate(dueDate);
      // Don't let an in-flight refetch land after our optimistic write.
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (tasks) =>
        tasks?.map((task) => (task.id === id ? { ...task, status } : task)),
      );

      return { previous, queryKey };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
  });
}
