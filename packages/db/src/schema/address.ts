import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { doublePrecision, index, text, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { userTable } from "./user";

export const addressTable = pgTable(
  "addresses",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    line1: varchar("line1", { length: 128 }).notNull(),
    line2: varchar("line2", { length: 128 }),
    city: varchar("city", { length: 128 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    zipCode: varchar("zip_code", { length: 5 }).notNull(),
    longitude: doublePrecision("longitude").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (address) => ({
    userIdIdx: index("address_userId_idx").on(address.userId),
  }),
);

export const addressRelations = relations(addressTable, ({ one }) => ({
  user: one(userTable, {
    fields: [addressTable.userId],
    references: [userTable.id],
  }),
}));
