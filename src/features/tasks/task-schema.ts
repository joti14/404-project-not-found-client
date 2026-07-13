import { z } from "zod";

/**
 * Shared validation for create AND edit (one schema, one source of truth).
 *
 * Tags are typed as the raw comma-separated input string and transformed
 * into the cleaned array the API expects - the same trim/dedupe/limit
 * rules the backend serializer enforces.
 */
export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Keep the title under 200 characters."),
  description: z
    .string()
    .trim()
    .max(2000, "Keep the description under 2000 characters."),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date."),
  tags: z
    .string()
    .transform((raw) => {
      const cleaned: string[] = [];
      for (const part of raw.split(",")) {
        const tag = part.trim();
        if (tag && !cleaned.includes(tag)) cleaned.push(tag);
      }
      return cleaned;
    })
    .pipe(
      z
        .array(z.string().max(32, "Tags must be 32 characters or fewer."))
        .max(10, "Use at most 10 tags."),
    ),
});

/** What the form fields hold (tags still a raw string). */
export type TaskFormInput = z.input<typeof taskSchema>;

/** What validation produces (tags as a cleaned array) - the API payload. */
export type TaskFormValues = z.output<typeof taskSchema>;
