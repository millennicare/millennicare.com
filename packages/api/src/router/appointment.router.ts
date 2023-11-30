import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { and, eq, or } from "@millennicare/db";
import { appointments as appointmentSchema } from "@millennicare/db/schema/appointment";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const appointmentRouter = router({
  createAppointment: publicProcedure
    .input(
      z.object({
        startTime: z.date(),
        endTime: z.date(),
        status: z.enum(["cancelled", "pending", "confirmed", "finished"]),
        serviceId: z.string().cuid2(),
        careseekerId: z.string().cuid2(),
        caregiverId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      await db.insert(appointmentSchema).values(input);
    }),
  updateAppointment: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid2(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        status: z
          .enum(["cancelled", "pending", "confirmed", "finished"])
          .optional(),
        serviceId: z.string().cuid2().optional(),
        careseekerId: z.string().cuid2(),
        caregiverId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      await db
        .update(appointmentSchema)
        .set(input)
        .where(
          and(
            or(
              eq(appointmentSchema.caregiverId, userId),
              eq(appointmentSchema.careseekerId, userId),
            ),
            eq(appointmentSchema.id, input.id),
          ),
        );
    }),
  getAppointmentById: protectedProcedure
    .input(z.object({ id: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      const appointment = await db.query.appointments.findFirst({
        where: and(
          or(
            eq(appointmentSchema.caregiverId, userId),
            eq(appointmentSchema.careseekerId, userId),
          ),
          eq(appointmentSchema.id, input.id),
        ),
      });
      if (!appointment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No appointment found",
        });
      }
      return appointment;
    }),
  // a logged in user, either careseeker or caregiver, is getting their own appts
  getAppointmentsByUserId: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;
    const appointments = await db.query.appointments.findMany({
      where: or(
        eq(appointmentSchema.caregiverId, userId),
        eq(appointmentSchema.careseekerId, userId),
      ),
    });

    if (!appointments) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No appointments found.",
      });
    }

    return appointments;
  }),
  deleteAppointment: protectedProcedure
    .input(z.object({ id: z.string().cuid2() }))
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      await db
        .delete(appointmentSchema)
        .where(
          and(
            or(
              eq(appointmentSchema.caregiverId, userId),
              eq(appointmentSchema.careseekerId, userId),
            ),
            eq(appointmentSchema.id, input.id),
          ),
        );
    }),
  getNextAppointment: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;
    const appointments = await db
      .select()
      .from(appointmentSchema)
      .where(
        and(
          or(
            eq(appointmentSchema.careseekerId, userId),
            eq(appointmentSchema.caregiverId, userId),
          ),
          or(
            eq(appointmentSchema.status, "pending"),
            eq(appointmentSchema.status, "confirmed"),
          ),
        ),
      );

    if (!appointments) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No appointments found",
      });
    }

    const today = new Date();
    const beforeDates = appointments.filter((app) => {
      return app.status === "confirmed" || app.status === "pending";
    });
    beforeDates.sort((a, b) => {
      const distanceA = Math.abs(today.valueOf() - a.endTime.valueOf());
      const distanceB = Math.abs(today.valueOf() - b.endTime.valueOf());
      return distanceA - distanceB;
    });

    return beforeDates[0];
  }),
  getLastCompletedAppointment: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;
    // gets appointments based on if the appointment is completed
    // and if the careseeker/giver id matches the userId from ctx
    const appointments = await db
      .select()
      .from(appointmentSchema)
      .where(
        and(
          or(
            eq(appointmentSchema.careseekerId, userId),
            eq(appointmentSchema.caregiverId, userId),
          ),
          eq(appointmentSchema.status, "finished"),
        ),
      );
    if (!appointments) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No appointments found",
      });
    }

    // find last completed appointment
    // find appointment that is most recently completed from todays date
    const today = new Date();
    const beforeDates = appointments.filter(
      (app) => app.endTime.valueOf() - today.valueOf() < 0,
    );

    return beforeDates[0];
  }),
});
