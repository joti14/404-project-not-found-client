"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage, getFieldErrors } from "@/services/api-client";
import type { Task } from "@/types/task";

import { TaskForm } from "./task-form";
import type { TaskFormInput, TaskFormValues } from "./task-schema";
import { useCreateTask } from "./use-create-task";
import { useUpdateTask } from "./use-update-task";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the modal edits this task; otherwise it creates one. */
  task?: Task | null;
  /** The board's selected date - default due_date for new tasks. */
  boardDate: string;
}

/**
 * One modal for create and edit. The mode is derived from the presence
 * of `task`; only the heading, initial values, and target mutation vary.
 */
export function TaskModal({ open, onOpenChange, task, boardDate }: TaskModalProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isEdit = Boolean(task);
  const mutation = isEdit ? updateTask : createTask;

  const defaultValues: TaskFormInput = task
    ? {
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.due_date,
        tags: task.tags.join(", "),
      }
    : {
        title: "",
        description: "",
        priority: "medium",
        due_date: boardDate,
        tags: "",
      };

  const handleSubmit = (values: TaskFormValues) => {
    const onSuccess = () => onOpenChange(false);
    if (task) {
      updateTask.mutate(
        { id: task.id, payload: values, previousDueDate: task.due_date },
        { onSuccess },
      );
    } else {
      createTask.mutate({ ...values, status: "todo" }, { onSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this task."
              : "Add a task to your board."}
          </DialogDescription>
        </DialogHeader>

        {/* key remounts the form when the target task changes, so RHF
            defaultValues are re-applied instead of leaking between tasks */}
        <TaskForm
          key={task?.id ?? "create"}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel={isEdit ? "Save changes" : "Create task"}
          isPending={mutation.isPending}
          serverFieldErrors={getFieldErrors(mutation.error)}
          serverError={
            mutation.isError && Object.keys(getFieldErrors(mutation.error)).length === 0
              ? getApiErrorMessage(mutation.error, "Could not save the task.")
              : null
          }
        />
      </DialogContent>
    </Dialog>
  );
}
