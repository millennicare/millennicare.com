import { and, eq, schema } from "@millennicare/db";
import { createChildSchema, selectChildSchema } from "@millennicare/validators";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const childRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createChildSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      await db.insert(schema.childTable).values({
        name: input.name,
        age: input.age,
        userId: userId,
      });
    }),
  getById: protectedProcedure
    .input(z.object({ childId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      const child = await db.query.childTable.findFirst({
        where: and(
          eq(schema.childTable.id, input.childId),
          eq(schema.childTable.userId, userId),
        ),
      });

      if (!child) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return child;
    }),
  getByCareseekerId: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;

    const children = await db.query.childTable.findMany({
      where: eq(schema.childTable.userId, userId),
    });

    return children;
  }),
  update: protectedProcedure
    .input(selectChildSchema.partial().required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      await db
        .update(schema.childTable)
        .set({
          name: input.name,
          age: input.age,
        })
        .where(
          and(
            eq(schema.childTable.id, input.id),
            eq(schema.childTable.userId, userId),
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
        .delete(schema.childTable)
        .where(
          and(
            eq(schema.childTable.id, input.childId),
            eq(schema.childTable.userId, userId),
          ),
        );
    }),
});
