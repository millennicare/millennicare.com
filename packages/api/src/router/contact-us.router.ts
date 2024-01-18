import { schema } from "@millennicare/db";
import { createContactSchema } from "@millennicare/validators";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const contactUsRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(createContactSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.insert(schema.contactUs).values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        message: input.message,
      });
    }),
});
