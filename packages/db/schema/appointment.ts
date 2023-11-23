import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  mysqlEnum,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { caregivers, careseekers } from "./auth";
import { services } from "./service";

export const appointments = mySqlTable(
  "appointment",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey()
      .notNull()
      .unique(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt").onUpdateNow(),

    startTime: timestamp("startTime").notNull(),
    endTime: timestamp("endTime").notNull(),
    status: mysqlEnum("status", [
      "cancelled",
      "pending",
      "confirmed",
      "finished",
    ]).notNull(),
    serviceId: varchar("serviceId", { length: 128 })
      .notNull()
      .references(() => services.id),
    careseekerId: varchar("careseekerId", { length: 128 })
      .notNull()
      .references(() => careseekers.id),
    caregiverId: varchar("caregiverId", { length: 128 })
      .notNull()
      .references(() => caregivers.id),
  },
  (appointment) => {
    return {
      parentRef: foreignKey({
        columns: [
          appointment.serviceId,
          appointment.caregiverId,
          appointment.careseekerId,
        ],
        foreignColumns: [services.id, caregivers.id, careseekers.id],
        name: "appointment_fk",
      }),
      serviceIdIdx: index("serviceId_idx").on(appointment.serviceId),
      careseekerIdIdx: index("careseekerId_idx").on(appointment.careseekerId),
      caregiverIdIdx: index("caregiverId_idx").on(appointment.caregiverId),
    };
  },
);

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  service: one(services, {
    fields: [appointments.id],
    references: [services.id],
  }),
  careseeker: one(careseekers, {
    fields: [appointments.id],
    references: [careseekers.id],
  }),
  caregiver: one(caregivers, {
    fields: [appointments.id],
    references: [caregivers.id],
  }),
}));
