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
    updatedAt: timestamp("updated_at").onUpdateNow(),

    zipCode: varchar("zip_code", { length: 5 }).notNull(),
    longitude: float("longitude").notNull(),
    latitude: float("latitude").notNull(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id),
  },
  (address) => ({
    userIdIdx: index("userId_idx").on(address.userId),
  }),
);

export const addressRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id], // Update the reference to users.id
  }),
}));
