import { z } from "zod";

import { eq, schema } from "@millennicare/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db
        .insert(schema.waitlistTable)
        .values({ email: input.email, contacted: false });
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
