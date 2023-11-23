import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { float, index, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";

export const addresses = mySqlTable(
  "address",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt").onUpdateNow(),

    longitude: float("longitude").notNull(),
    latitude: float("latitude").notNull(),
    address: varchar("address", { length: 255 }),
    unit: varchar("unit", { length: 255 }),
    userId: varchar("user_id", { length: 128 }).notNull().notNull().unique(),
  },
  (address) => ({
    userIdIdx: index("userId_idx").on(address.userId),
  }),
);

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.id],
    references: [users.id],
  }),
}));
