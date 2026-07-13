import { apiClient } from "@/services/api-client";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

export interface TaskPayload {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;
  tags: string[];
  status?: TaskStatus;
}

export const taskService = {
  /** Tasks for one calendar day (the board view). */
  async getTasks(dueDate: string): Promise<Task[]> {
    const { data } = await apiClient.get<Task[]>("/api/tasks/", {
      params: { due_date: dueDate },
    });
    return data;
  },

  async createTask(payload: TaskPayload): Promise<Task> {
    const { data } = await apiClient.post<Task>("/api/tasks/", payload);
    return data;
  },

  async updateTask(id: number, payload: Partial<TaskPayload>): Promise<Task> {
    const { data } = await apiClient.patch<Task>(`/api/tasks/${id}/`, payload);
    return data;
  },

  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(`/api/tasks/${id}/`);
  },
};
