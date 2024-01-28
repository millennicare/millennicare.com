import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { char, float, index, timestamp, varchar } from "drizzle-orm/mysql-core";

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

    zipCode: char("zip_code", { length: 5 }).notNull(),
    longitude: float("longitude").notNull(),
    latitude: float("latitude").notNull(),
    userId: varchar("user_id", { length: 128 }).notNull(),
  },
  (address) => ({
    userIdIdx: index("userId_idx").on(address.userId),
  }),
);

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));
