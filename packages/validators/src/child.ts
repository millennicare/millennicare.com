import { z } from "zod";

export const createChildSchema = z.object({
  age: z.number().int().gte(0).lte(18),
  name: z.string().min(1, { message: "Name is required." }),
  userId: z.string().cuid2(),
});

export const selectChildSchema = createChildSchema.extend({
  id: z.string().cuid2(),
});

export const updateChildSchema = selectChildSchema
  .partial()
  .required({ id: true });

export type Child = z.infer<typeof selectChildSchema>;
export type UpdateChild = z.infer<typeof updateChildSchema>;
