import { TRPCError } from "@trpc/server";

import { eq } from "@millennicare/db";
import { User, UserInfo } from "@millennicare/db/schema";
import { updateUserSchema } from "@millennicare/validators";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      await db
        .update(User)
        .set({
          ...input,
        })
        .where(eq(User.id, userId));
    }),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    await db.delete(User).where(eq(User.id, userId));
  }),
  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    const userInfo = await db.query.User.findFirst({
      where: eq(UserInfo.userId, userId),
    });

    if (!userInfo) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return userInfo;
  }),
});
