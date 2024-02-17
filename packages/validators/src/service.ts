import { z } from "zod";

export const categoryEnum = z.enum([
  "child_care",
  "senior_care",
  "housekeeping",
  "petcare",
]);

export const createServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().multipleOf(0.01),
  category: categoryEnum,
  userId: z.string().cuid2(),
});

export const selectServiceSchema = z.object({
  id: z.string().cuid2(),
});

export type Service = z.infer<typeof selectServiceSchema>;
