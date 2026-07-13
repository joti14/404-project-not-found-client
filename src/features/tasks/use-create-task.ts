"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { taskService, type TaskPayload } from "@/services/task-service";

import { taskKeys } from "./use-tasks";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskPayload) => taskService.createTask(payload),
    onSuccess: (created) => {
      // Only the day the task landed on is stale.
      queryClient.invalidateQueries({
        queryKey: taskKeys.byDate(created.due_date),
      });
    },
  });
}
