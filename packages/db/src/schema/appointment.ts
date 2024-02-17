import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { index, pgEnum, text, timestamp } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { caregiverTable } from "./caregiver";
import { careseekerTable } from "./careseeker";
import { serviceTable } from "./service";

export const statusEnum = pgEnum("status", [
  "cancelled",
  "pending",
  "confirmed",
  "finished",
]);

export const appointmentTable = pgTable(
  "appointments",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull(),

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

export const appointmentsRelations = relations(appointmentTable, ({ one }) => ({
  service: one(serviceTable, {
    fields: [appointmentTable.id],
    references: [serviceTable.id],
  }),
  careseeker: one(careseekerTable, {
    fields: [appointmentTable.id],
    references: [careseekerTable.userId],
  }),
  caregiver: one(caregiverTable, {
    fields: [appointmentTable.id],
    references: [caregiverTable.userId],
  }),
}));
