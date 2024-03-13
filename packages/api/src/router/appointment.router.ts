import { and, eq, or, schema } from "@millennicare/db";
import {
  createAppointmentSchema,
  selectAppointmentSchema,
} from "@millennicare/validators";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const appointmentRouter = createTRPCRouter({
  createAppointment: publicProcedure
    .input(createAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      await db.insert(schema.appointmentTable).values(input);
    }),
  updateAppointment: protectedProcedure
    .input(selectAppointmentSchema.partial().required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      await db
        .update(schema.appointmentTable)
        .set(input)
        .where(
          and(
            or(
              eq(schema.appointmentTable.caregiverId, userId),
              eq(schema.appointmentTable.careseekerId, userId),
            ),
            eq(schema.appointmentTable.id, input.id),
          ),
        );
    }),
  getAppointmentById: protectedProcedure
    .input(z.object({ id: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      const appointment = await db.query.appointmentTable.findFirst({
        where: and(
          or(
            eq(schema.appointmentTable.caregiverId, userId),
            eq(schema.appointmentTable.careseekerId, userId),
          ),
          eq(schema.appointmentTable.id, input.id),
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
    const appointments = await db.query.appointmentTable.findMany({
      where: or(
        eq(schema.appointmentTable.caregiverId, userId),
        eq(schema.appointmentTable.careseekerId, userId),
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
        .delete(schema.appointmentTable)
        .where(
          and(
            or(
              eq(schema.appointmentTable.caregiverId, userId),
              eq(schema.appointmentTable.careseekerId, userId),
            ),
            eq(schema.appointmentTable.id, input.id),
          ),
        );
    }),
  getNextAppointment: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;
    const appointments = await db
      .select()
      .from(schema.appointmentTable)
      .where(
        and(
          or(
            eq(schema.appointmentTable.careseekerId, userId),
            eq(schema.appointmentTable.caregiverId, userId),
          ),
          or(
            eq(schema.appointmentTable.status, "pending"),
            eq(schema.appointmentTable.status, "confirmed"),
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
    const { db, userId } = ctx;
    // gets appointments based on if the appointment is completed
    // and if the careseeker/giver id matches the userId from ctx
    const appointments = await db
      .select()
      .from(schema.appointmentTable)
      .where(
        and(
          or(
            eq(schema.appointmentTable.careseekerId, userId),
            eq(schema.appointmentTable.caregiverId, userId),
          ),
          eq(schema.appointmentTable.status, "finished"),
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
