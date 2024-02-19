import { TRPCError } from "@trpc/server";

import { eq, schema } from "@millennicare/db";
import { updateUserSchema } from "@millennicare/validators";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      await db
        .update(schema.userTable)
        .set({
          ...input,
        })
        .where(eq(schema.userTable.id, userId));
    }),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const { db, userId } = ctx;

    await db.delete(schema.userTable).where(eq(schema.userTable.id, userId));
  }),
  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;

    const userInfo = await db.query.userInfoTable.findFirst({
      where: eq(schema.userInfoTable.userId, userId),
    });

    if (!userInfo) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return userInfo;
  }),
});
