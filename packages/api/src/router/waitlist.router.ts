import { eq, schema } from "@millennicare/db";
import { sendWaitlistConfirmationEmail } from "@millennicare/lib";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      try {
        await db
          .insert(schema.waitlistTable)
          .values({ email: input.email, contacted: false });

        await sendWaitlistConfirmationEmail({ email: input.email });
      } catch (error) {
        console.error(error);
      }
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string().cuid2(),
        email: z.string().email(),
        contacted: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db
        .update(schema.waitlistTable)
        .set(input)
        .where(eq(schema.waitlistTable.id, input.id));
    }),
});
