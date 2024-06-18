import { Contact, insertContactSchema } from "@millennicare/db/schema";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const contactUsRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(insertContactSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.insert(Contact).values(input);
    }),
});
