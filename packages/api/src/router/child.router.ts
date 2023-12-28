import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { and, eq, schema } from "@millennicare/db";

import { protectedProcedure, router } from "../trpc";

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

      await db.insert(schema.children).values({
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
          eq(schema.children.id, input.childId),
          eq(schema.children.userId, ctx.userId),
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
      .from(schema.children)
      .where(eq(schema.children.userId, userId));

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
        .update(schema.children)
        .set({
          name: input.name,
          age: input.age,
        })
        .where(
          and(
            eq(schema.children.id, input.childId),
            eq(schema.children.userId, userId),
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
        .delete(schema.children)
        .where(
          and(
            eq(schema.children.id, input.childId),
            eq(schema.children.userId, userId),
          ),
        );
    }),
});
