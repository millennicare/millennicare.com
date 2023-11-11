import * as z from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const caregiverRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.string().cuid())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const caregiver = await db.user.findUnique({
        where: {
          id: input,
        },
        select: {
          profilePicture: true,
          name: true,
        },
      });
      return caregiver;
    }),
});
