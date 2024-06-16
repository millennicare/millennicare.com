import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  doublePrecision,
  index,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Caregiver } from "./caregiver";

export const categoryEnum = pgEnum("category", [
  "child_care",
  "senior_care",
  "housekeeping",
  "pet_care",
]);

export const Service = pgTable(
  "services",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),

    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    price: doublePrecision("price").notNull(),
    category: categoryEnum("category").notNull(),
    userId: text("caregiver_id")
      .notNull()
      .references(() => Caregiver.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (service) => ({
    userIdIdx: index("service_userId_idx").on(service.userId),
  }),
);

export const ServiceRelations = relations(Service, ({ one }) => ({
  caregiver: one(Caregiver, {
    fields: [Service.userId],
    references: [Caregiver.userId],
  }),
}));

export const insertServiceSchema = createInsertSchema(Service);
export const selectServiceSchema = createSelectSchema(Service);
