"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DateSelector } from "@/components/ui/date-selector";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types/task";

import {
  taskSchema,
  type TaskFormInput,
  type TaskFormValues,
} from "./task-schema";

const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

interface TaskFormProps {
  defaultValues: TaskFormInput;
  onSubmit: (values: TaskFormValues) => void;
  submitLabel: string;
  isPending: boolean;
  /** Per-field messages from the backend, e.g. {"title": "..."} */
  serverFieldErrors?: Record<string, string>;
  serverError?: string | null;
}

/**
 * Mode-agnostic task form: it neither knows nor cares whether the values
 * end up in a POST or a PATCH. The modal decides that.
 */
export function TaskForm({
  defaultValues,
  onSubmit,
  submitLabel,
  isPending,
  serverFieldErrors = {},
  serverError,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: "onTouched",
    defaultValues,
  });

  const fieldError = (name: keyof TaskFormInput) =>
    errors[name]?.message ?? serverFieldErrors[name];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {serverError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            <CircleAlert className="size-4 shrink-0" aria-hidden />
            {serverError}
          </div>
        )}

        <Field data-invalid={!!fieldError("title")}>
          <FieldLabel htmlFor="task-title">Title</FieldLabel>
          <Input
            id="task-title"
            placeholder="What needs doing?"
            aria-invalid={!!fieldError("title")}
            {...register("title")}
          />
          <FieldError errors={[{ message: fieldError("title") }]} />
        </Field>

        <Field data-invalid={!!fieldError("description")}>
          <FieldLabel htmlFor="task-description">
            Description{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Textarea
            id="task-description"
            placeholder="Add details…"
            rows={3}
            aria-invalid={!!fieldError("description")}
            {...register("description")}
          />
          <FieldError errors={[{ message: fieldError("description") }]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!fieldError("priority")}>
            <FieldLabel>Priority</FieldLabel>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-label="Priority"
                  className="grid grid-cols-3 rounded-lg border p-0.5"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-sm transition-colors",
                        field.value === option.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            />
            <FieldError errors={[{ message: fieldError("priority") }]} />
          </Field>

          <Field data-invalid={!!fieldError("due_date")}>
            <FieldLabel>Due date</FieldLabel>
            <Controller
              control={control}
              name="due_date"
              render={({ field }) => (
                <DateSelector value={field.value} onChange={field.onChange} />
              )}
            />
            <FieldError errors={[{ message: fieldError("due_date") }]} />
          </Field>
        </div>

        <Field data-invalid={!!fieldError("tags")}>
          <FieldLabel htmlFor="task-tags">
            Tags{" "}
            <span className="font-normal text-muted-foreground">
              (comma separated)
            </span>
          </FieldLabel>
          <Input
            id="task-tags"
            placeholder="frontend, urgent"
            aria-invalid={!!fieldError("tags")}
            {...register("tags")}
          />
          <FieldError errors={[{ message: fieldError("tags") }]} />
        </Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
