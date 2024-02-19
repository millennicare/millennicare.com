import { z } from "zod";

export const createCareseekerSchema = z.object({
  userId: z.string().cuid2(),
});

export const selectCareseekerSchema = createCareseekerSchema;

export type Careseeker = z.infer<typeof selectCareseekerSchema>;
