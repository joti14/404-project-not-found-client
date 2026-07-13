"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { taskService, type TaskPayload } from "@/services/task-service";

import { taskKeys } from "./use-tasks";

interface UpdateTaskVariables {
  id: number;
  payload: Partial<TaskPayload>;
  /** The task's due_date before the edit, so its old day can be refreshed. */
  previousDueDate: string;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTaskVariables) =>
      taskService.updateTask(id, payload),
    onSuccess: (updated, { previousDueDate }) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.byDate(updated.due_date),
      });
      // If the edit moved the task to another day, that day changed too.
      if (previousDueDate !== updated.due_date) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.byDate(previousDueDate),
        });
      }
    },
  });
}
