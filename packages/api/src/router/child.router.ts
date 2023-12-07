import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { and, eq } from "@millennicare/db";
import { children as childSchema } from "@millennicare/db/schema/child";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const childRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        age: z.number().int().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.insert(childSchema).values({
        name: input.name,
        age: input.age,
        userId: ctx.userId,
      });
    }),
  getById: protectedProcedure
    .input(z.object({ childId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const child = await db.query.children.findFirst({
        where: and(
          eq(childSchema.id, input.childId),
          eq(childSchema.userId, ctx.userId),
        ),
      });

      if (!child) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return child;
    }),
  getByCareseekerId: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;

    const children = await db
      .select()
      .from(childSchema)
      .where(eq(childSchema.userId, userId));

    return children;
  }),
  update: protectedProcedure
    .input(
      z.object({
        childId: z.string().cuid2(),
        name: z.string(),
        age: z.coerce.number().int().gte(0).lte(18),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      await db
        .update(childSchema)
        .set({
          name: input.name,
          age: input.age,
        })
        .where(
          and(
            eq(childSchema.id, input.childId),
            eq(childSchema.userId, userId),
          ),
        );
    }),
  delete: protectedProcedure
    .input(
      z.object({
        childId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      await db
        .delete(childSchema)
        .where(
          and(
            eq(childSchema.id, input.childId),
            eq(childSchema.userId, userId),
          ),
        );
    }),
});
