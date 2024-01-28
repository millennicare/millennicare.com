import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { float, index, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

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
    userId: varchar("user_id", { length: 128 }).notNull(),
  },
  (address) => ({
    userIdIdx: index("userId_idx").on(address.userId),
  }),
);
