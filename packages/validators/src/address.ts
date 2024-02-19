import { z } from "zod";

export const createAddressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string().length(2),
  zipCode: z.string().length(5),
  longitude: z.number(),
  latitude: z.number(),
  placeId: z.string(),
  userId: z.string().cuid2(),
});

export const selectAddressSchema = createAddressSchema.extend({
  id: z.string().cuid2(),
});

export type Address = z.infer<typeof selectAddressSchema>;
