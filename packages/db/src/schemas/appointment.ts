import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Caregiver } from "./caregiver";
import { Careseeker } from "./careseeker";
import { Service } from "./service";

export const statusEnum = pgEnum("status", [
  "cancelled",
  "pending",
  "confirmed",
  "finished",
]);

export const Appointment = pgTable(
  "appointments",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    startTime: timestamp("startTime").notNull(),
    endTime: timestamp("endTime").notNull(),
    status: statusEnum("status").notNull(),
    serviceId: text("service_id").notNull(),
    careseekerId: text("careseeker_id").notNull(),
    caregiverId: text("caregiver_id").notNull(),
  },
  (appointment) => ({
    serviceIdIdx: index("appointment_serviceId_idx").on(appointment.serviceId),
    careseekerIdIdx: index("appointment_careseekerId_idx").on(
      appointment.careseekerId,
    ),
    caregiverIdIdx: index("appointment_caregiverId_idx").on(
      appointment.caregiverId,
    ),
  }),
);

export const AppointmentsRelations = relations(Appointment, ({ one }) => ({
  service: one(Service, {
    fields: [Appointment.id],
    references: [Service.id],
  }),
  careseeker: one(Careseeker, {
    fields: [Appointment.id],
    references: [Careseeker.userId],
  }),
  caregiver: one(Caregiver, {
    fields: [Appointment.id],
    references: [Caregiver.userId],
  }),
}));

export const insertAppointmentschema = createInsertSchema(Appointment);
export const selectAppointmentSchema = createSelectSchema(Appointment);
