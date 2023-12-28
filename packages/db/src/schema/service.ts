import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { double, mysqlEnum, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { appointments } from "./appointment";
import { caregivers } from "./auth";

export const services = mySqlTable("service", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey()
    .unique(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),

  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  price: double("price", { precision: 10, scale: 2 }).notNull(),
  category: mysqlEnum("category", [
    "child_care",
    "senior_care",
    "housekeeping",
    "petcare",
  ]),
  caregiverId: varchar("caregiver_id", { length: 128 }).notNull(),
});

export const servicesRelations = relations(services, ({ many, one }) => ({
  appointments: many(appointments),
  caregiver: one(caregivers, {
    fields: [services.id],
    references: [caregivers.id],
  }),
}));