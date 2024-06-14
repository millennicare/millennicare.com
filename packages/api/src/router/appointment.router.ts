import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { and, eq, or } from "@millennicare/db";
import { Appointment } from "@millennicare/db/schema";
import {
  createAppointmentSchema,
  selectAppointmentSchema,
} from "@millennicare/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const appointmentRouter = createTRPCRouter({
  createAppointment: publicProcedure
    .input(createAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      await db.insert(Appointment).values(input);
    }),
  updateAppointment: protectedProcedure
    .input(selectAppointmentSchema.partial().required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      await db
        .update(Appointment)
        .set(input)
        .where(
          and(
            or(
              eq(Appointment.caregiverId, userId),
              eq(Appointment.careseekerId, userId),
            ),
            eq(Appointment.id, input.id),
          ),
        );
    }),
  getAppointmentById: protectedProcedure
    .input(z.object({ id: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      const appointment = await db.query.Appointment.findFirst({
        where: and(
          or(
            eq(Appointment.caregiverId, userId),
            eq(Appointment.careseekerId, userId),
          ),
          eq(Appointment.id, input.id),
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
    const { db, session } = ctx;
    const userId = session.user.id;

    const appointments = await db.query.Appointment.findMany({
      where: or(
        eq(Appointment.caregiverId, userId),
        eq(Appointment.careseekerId, userId),
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
      const { db, session } = ctx;
      const userId = session.user.id;

      await db
        .delete(Appointment)
        .where(
          and(
            or(
              eq(Appointment.caregiverId, userId),
              eq(Appointment.careseekerId, userId),
            ),
            eq(Appointment.id, input.id),
          ),
        );
    }),
  getNextAppointment: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    const appointments = await db
      .select()
      .from(Appointment)
      .where(
        and(
          or(
            eq(Appointment.careseekerId, userId),
            eq(Appointment.caregiverId, userId),
          ),
          or(
            eq(Appointment.status, "pending"),
            eq(Appointment.status, "confirmed"),
          ),
        ),
      );

    if (!appointments || appointments.length === 0) {
      return null;
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

    const date = beforeDates[0];
    if (!date) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return date;
  }),
  getLastCompletedAppointment: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    // gets appointments based on if the appointment is completed
    // and if the careseeker/giver id matches the userId from ctx
    const appointments = await db
      .select()
      .from(Appointment)
      .where(
        and(
          or(
            eq(Appointment.careseekerId, userId),
            eq(Appointment.caregiverId, userId),
          ),
          eq(Appointment.status, "finished"),
        ),
      );
    if (!appointments || appointments.length === 0) {
      return null;
    }

    // find last completed appointment
    // find appointment that is most recently completed from todays date
    const today = new Date();
    const beforeDates = appointments.filter(
      (app) => app.endTime.valueOf() - today.valueOf() < 0,
    );

    const date = beforeDates[0];
    if (!date) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return date;
  }),
});
