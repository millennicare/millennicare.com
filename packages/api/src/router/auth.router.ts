import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { eq } from "@millennicare/db";
import { users as userSchema } from "@millennicare/db/schema/auth";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { userId, db } = ctx;

    const user = await db.query.users.findFirst({
      where: eq(userSchema.id, userId),
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
        where: eq(userSchema.email, input.email),
      });

      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user already exists with this email address.",
        });
      }
    }),
});
