"use client";

import { useQuery } from "@tanstack/react-query";

import { taskService } from "@/services/task-service";

/**
 * Query-key factory. Every task query and (later) every mutation
 * invalidation goes through these builders, so cache keys can never
 * drift apart across the codebase.
 */
export const taskKeys = {
  all: ["tasks"] as const,
  byDate: (date: string) => [...taskKeys.all, date] as const,
};

/** Tasks for the given date, cached per day. */
export function useTasks(dueDate: string) {
  return useQuery({
    queryKey: taskKeys.byDate(dueDate),
    queryFn: () => taskService.getTasks(dueDate),
  });
}
