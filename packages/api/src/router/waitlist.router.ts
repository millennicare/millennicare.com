import { z } from "zod";

import { eq } from "@millennicare/db";
import { insertWaitlistSchema, Waitlist } from "@millennicare/db/schema";
import { sendWaitlistConfirmationEmail } from "@millennicare/lib";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(insertWaitlistSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      try {
        await db.insert(Waitlist).values({ email: input.email });

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

      await db.update(Waitlist).set(input).where(eq(Waitlist.id, input.id));
    }),
});
