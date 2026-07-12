import { apiClient } from "@/services/api-client";
import type { Task } from "@/types/task";

export const taskService = {
  /** Tasks for one calendar day (the board view). */
  async getTasks(dueDate: string): Promise<Task[]> {
    const { data } = await apiClient.get<Task[]>("/api/tasks/", {
      params: { due_date: dueDate },
    });
    return data;
  },
};
