import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(400, "Description must be less than 400 characters"),
  imageUrl: z.string(),
  startDateTime: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date
        ? new Date(val)
        : undefined,
    z.date()
  ),
  endDateTime: z.preprocess(
    (val) =>
      typeof val === "string" || val instanceof Date
        ? new Date(val)
        : undefined,
    z.date()
  ),
  price: z.string(),
  isFree: z.boolean(),
  availableSeats: z.number().default(100),
});
