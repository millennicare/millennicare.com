import * as z from "zod";

import { publicProcedure, protectedProcedure, createTRPCRouter } from "../trpc";

export const appointmentRouter = createTRPCRouter({
  createAppointment: publicProcedure
    .input(
      z.object({
        startTime: z.date(),
        endTime: z.date(),
        careseekerId: z.string().cuid(),
        caregiverId: z.string().cuid(),
        serviceId: z.string().cuid(),
        status: z.enum(["cancelled", "pending", "confirmed", "pending"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.db.appointment.create({
        data: {
          startTime: input.startTime,
          endTime: input.endTime,
          careseekerId: input.careseekerId,
          caregiverId: input.caregiverId,
          serviceId: input.serviceId,
          status: input.status,
        },
      });

      return appointment;
    }),
  getAppointmentsByUserId: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;

    const appointments = await db.appointment.findMany({
      where: {
        OR: [
          {
            careseekerId: userId,
          },
          {
            caregiverId: userId,
          },
        ],
      },
    });

    return appointments;
  }),
  getAppointmenyById: protectedProcedure
    .input(z.string().cuid())
    .query(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      const appointment = await db.appointment.findUnique({
        where: {
          id: input,
          OR: [
            {
              careseekerId: userId,
            },
            {
              caregiverId: userId,
            },
          ],
        },
        include: {
          Service: {
            select: {
              price: true,
            },
          },
        },
      });

      return appointment;
    }),
  updateAppointment: protectedProcedure
    .input(
      z
        .object({
          id: z.string().cuid(),
          startTime: z.date(),
          endTime: z.date(),
          careseekerId: z.string().cuid(),
          caregiverId: z.string().cuid(),
          serviceId: z.string().cuid(),
          status: z.enum(["cancelled", "pending", "confirmed", "pending"]),
        })
        .partial(),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedAppointment = await ctx.db.appointment.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
      return updatedAppointment;
    }),
  deleteAppointment: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      await db.appointment.delete({
        where: {
          id: input,
          OR: [
            {
              caregiverId: userId,
            },
            {
              careseekerId: userId,
            },
          ],
        },
      });
    }),
  // get next appt
  getNextAppointment: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;
    const appointments = await db.appointment.findMany({
      where: {
        status: "finished",
        OR: [
          {
            careseekerId: userId,
          },
          {
            caregiverId: userId,
          },
        ],
      },
      include: {
        Service: {
          select: {
            price: true,
          },
        },
      },
    });

    const today = new Date();
    const beforeDates = appointments.filter(
      (app) => app.endTime.valueOf() - today.valueOf() < 0,
    );

    const appointment = beforeDates[0];

    return appointment;
  }),
  // get last completed appt
  getLastCompletedAppointment: protectedProcedure.query(async ({ ctx }) => {
    const appointments = await ctx.db.appointment.findMany({
      where: {
        OR: [
          {
            caregiverId: ctx.userId,
          },
          {
            caregiverId: ctx.userId,
          },
        ],
      },
      include: {
        Service: {
          select: {
            price: true,
          },
        },
      },
    });

    const today = new Date();
    const beforeDates = appointments.filter((app) => {
      return app.status === "confirmed" || app.status === "pending";
    });
    beforeDates.sort((a, b) => {
      const distanceA = Math.abs(today.valueOf() - a.endTime.valueOf());
      const distanceB = Math.abs(today.valueOf() - b.endTime.valueOf());
      return distanceA - distanceB;
    });

    const appointment = beforeDates[0];
    return appointment;
  }),
});
