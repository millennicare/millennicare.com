import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, schema } from "@millennicare/db";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodByCustomerId,
  updatePaymentMethod,
} from "@millennicare/lib";

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
  createPayment: protectedProcedure
    .input(
      z.object({
        type: z.enum(["card"]),
        card: z.object({
          number: z.string(),
          exp_month: z.number().min(1).max(12).int(),
          exp_year: z.number(),
          cvc: z.string().length(3),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await createPaymentMethod({
        type: input.type,
        card: input.card,
        customer_id: user.stripeId,
      });
    }),

  updatePayment: protectedProcedure
    .input(
      z.object({
        payment_method_id: z.string(),
        billing_details: z
          .object({
            address: z.object({
              city: z.string(),
              country: z.string().length(2),
              line1: z.string(),
              line2: z.string(),
              postal_code: z.string(),
              state: z.string(),
            }),
          })
          .optional(),
        card: z
          .object({
            exp_month: z.number().min(1).max(12).int(),
            exp_year: z.number(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await updatePaymentMethod(input);
    }),
  getPaymentMethod: protectedProcedure
    .input(
      z.object({
        payment_method_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const paymentMethod = await getPaymentMethodByCustomerId({
        customer_id: user.stripeId,
        payment_method_id: input.payment_method_id,
      });

      return paymentMethod;
    }),
  getPaymentMethodsByCustomerId: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const paymentMethods = await getAllPaymentMethods({
      customer_id: user.stripeId,
    });

    return paymentMethods;
  }),
  deletePaymentMethod: protectedProcedure
    .input(
      z.object({
        payment_method_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await deletePaymentMethod(input.payment_method_id);
    }),
});
