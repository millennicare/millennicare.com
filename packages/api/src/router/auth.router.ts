import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { eq, schema } from "@millennicare/db"

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { userId, db } = ctx;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: {
        address: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }
    return user;
  }),
  findDuplicateEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(schema.users.email, input.email),
      });

      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user already exists with this email address.",
        });
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().email().optional(),
        biography: z.string().optional().nullish(),
        profilePicture: z.string().url().optional(),
        birthdate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      await db
        .update(schema.users)
        .set({ ...input })
        .where(eq(schema.users.id, userId));
    }),
});
