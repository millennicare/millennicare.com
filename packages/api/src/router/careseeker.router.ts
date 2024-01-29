import { TRPCError } from "@trpc/server";

import { eq, schema } from "@millennicare/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const careseekerRouter = createTRPCRouter({
  getCareseeker: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;

    const careseeker = await db.query.careseekers.findFirst({
      where: eq(schema.careseekers.userId, userId),
    });

    if (!careseeker) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Careseeker not found",
      });
    }

    return careseeker;
  }),
});
