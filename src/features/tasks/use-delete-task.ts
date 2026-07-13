"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { taskService } from "@/services/task-service";

import { taskKeys } from "./use-tasks";

interface DeleteTaskVariables {
  id: number;
  /** The day the task lived on - the only cache entry that changed. */
  dueDate: string;
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteTaskVariables) => taskService.deleteTask(id),
    onSuccess: (_data, { dueDate }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byDate(dueDate) });
    },
  });
}
