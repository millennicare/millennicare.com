import validator from "validator";
import * as z from "zod";

import { schema } from "@millennicare/db";

import { publicProcedure, router } from "../trpc";

export const contactUsRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        phoneNumber: z.string().refine(validator.isMobilePhone).optional(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.insert(schema.contactUs).values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phoneNumber: input.phoneNumber,
        message: input.message,
      });
    }),
});
