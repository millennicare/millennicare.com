import { z } from "zod";

export const createChildSchema = z.object({
  age: z.number().int().gte(0).lte(18),
  name: z.string(),
  userId: z.string().cuid2(),
});

export const selectChildSchema = createChildSchema.extend({
  id: z.string().cuid2(),
});

export type Child = z.infer<typeof selectChildSchema>;
