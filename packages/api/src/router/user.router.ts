import { TRPCError } from "@trpc/server";

import { eq } from "@millennicare/db";
import { insertUserInfoSchema, User, UserInfo } from "@millennicare/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(insertUserInfoSchema)
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

    const userInfo = await db.query.UserInfo.findFirst({
      where: eq(UserInfo.userId, userId),
    });

    if (!userInfo) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return userInfo;
  }),
});
