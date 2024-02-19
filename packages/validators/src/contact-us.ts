import { z } from "zod";

export const createContactUsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export const selectContactUsSchema = createContactUsSchema.extend({
  id: z.string().cuid2(),
});

export type ContactUs = z.infer<typeof selectContactUsSchema>;
