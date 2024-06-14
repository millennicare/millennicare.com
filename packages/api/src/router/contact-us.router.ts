import { Contact } from "@millennicare/db/schema";
import { createContactUsSchema } from "@millennicare/validators";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const contactUsRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(createContactUsSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.insert(Contact).values(input);
    }),
});
