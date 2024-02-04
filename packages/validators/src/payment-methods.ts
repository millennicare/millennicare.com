import { z } from "zod";

export const paymentMethodInput = z.object({
  card: z.object({
    number: z
      .string()
      .length(16, { message: "Please enter a valid card number." }),
    exp_month: z.number().min(1).max(12).int(),
    exp_year: z.number(),
    cvc: z.string().length(3),
  }),
  billing_details: z.object({
    address: z.object({
      city: z.string(),
      country: z.string(),
      line1: z.string(),
      line2: z.string().optional(),
      postal_code: z.string(),
      state: z.string(),
    }),
    name: z.string(),
  }),
});
