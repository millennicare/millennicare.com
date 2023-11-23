import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { float, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";

export const addresses = mySqlTable("address", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").onUpdateNow(),

  longitude: float("longitude"),
  latitude: float("latitude"),
  address: varchar("address", { length: 255 }),
  unit: varchar("unit", { length: 255 }),
  userId: varchar("userId", { length: 128 }).notNull().unique(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.id],
    references: [users.id],
  }),
}));
