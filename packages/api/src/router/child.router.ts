import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { and, eq } from "@millennicare/db";
import { Child, insertChildSchema } from "@millennicare/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const childRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertChildSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      await db.insert(Child).values({
        name: input.name,
        age: input.age,
        userId: userId,
      });
    }),
  getById: protectedProcedure
    .input(z.object({ childId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      const child = await db.query.Child.findFirst({
        where: and(eq(Child.id, input.childId), eq(Child.userId, userId)),
      });

      if (!child) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return child;
    }),
  getByCareseekerId: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    const children = await db.query.Child.findMany({
      where: eq(Child.userId, userId),
    });

    return children;
  }),
  update: protectedProcedure
    .input(insertChildSchema.partial().required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      await db
        .update(Child)
        .set({
          name: input.name,
          age: input.age,
        })
        .where(and(eq(Child.id, input.id), eq(Child.userId, userId)));
    }),
  delete: protectedProcedure
    .input(
      z.object({
        childId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      await db
        .delete(Child)
        .where(and(eq(Child.id, input.childId), eq(Child.userId, userId)));
    }),
});
