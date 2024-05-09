import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  doublePrecision,
  index,
  pgEnum,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { caregiverTable } from "./caregiver";

export const categoryEnum = pgEnum("category", [
  "child_care",
  "senior_care",
  "housekeeping",
  "pet_care",
]);

export const serviceTable = pgTable(
  "services",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    price: doublePrecision("price").notNull(),
    category: categoryEnum("category").notNull(),
    userId: varchar("caregiver_id", { length: 128 })
      .notNull()
      .references(() => caregiverTable.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (service) => ({
    userIdIdx: index("service_userId_idx").on(service.userId),
  }),
);

export const serviceRelations = relations(serviceTable, ({ one }) => ({
  caregiver: one(caregiverTable, {
    fields: [serviceTable.userId],
    references: [caregiverTable.userId],
  }),
}));
