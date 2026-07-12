/** Shapes mirror the Django TaskSerializer (snake_case kept intentionally). */

export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}
