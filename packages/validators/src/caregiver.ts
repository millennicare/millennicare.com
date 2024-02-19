import { z } from "zod";

export const createCaregiverSchema = z.object({
  userId: z.string().cuid2(),
  backgroundCheckCompelted: z.boolean(),
});

export const selectCaregiverSchema = createCaregiverSchema;

export type Caregiver = z.infer<typeof selectCaregiverSchema>;
