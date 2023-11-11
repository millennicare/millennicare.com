import * as z from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const serviceRouter = createTRPCRouter({
  // create
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        price: z.number().min(0, "Price cannot be less than 0"),
        category: z.enum([
          "child_care",
          "senior_care",
          "pet_care",
          "housekeeping",
        ]),
        duration: z
          .number()
          .min(0, "Service duration cannot be less than 0 minutes"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, db } = ctx;

      await db.service.create({
        data: {
          ...input,
          caregiverId: userId,
        },
      });

      return { status: 201, message: "Appointment created" };
    }),
  // update
  update: protectedProcedure
    .input(
      z
        .object({
          id: z.string().cuid(),
          title: z.string(),
          description: z.string(),
          price: z.number().min(0, "Price cannot be less than 0"),
          category: z.enum([
            "child_care",
            "senior_care",
            "pet_care",
            "housekeeping",
          ]),
          duration: z
            .number()
            .min(0, "Service duration cannot be less than 0 minutes"),
        })
        .partial(),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      const updatedService = await db.service.update({
        where: {
          id: input.id,
          caregiverId: userId,
        },
        data: {
          ...input,
        },
      });
      return updatedService;
    }),
  // get all by caregiver id
  getByCaregiverId: publicProcedure
    .input(z.string().cuid())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const services = await db.service.findMany({
        where: {
          caregiverId: input,
        },
      });
      return services;
    }),
  // get by service id
  getById: publicProcedure
    .input(z.string().cuid())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const service = await db.service.findUnique({
        where: {
          id: input,
        },
      });
      return service;
    }),
  // delete by id
  // only a caregiver can delete their own service
  deleteById: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      await db.service.delete({
        where: {
          id: input,
          caregiverId: userId,
        },
      });
      return { status: 204, message: "Service deleted." };
    }),
});
