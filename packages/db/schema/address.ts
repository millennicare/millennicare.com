import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { float, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

export const address = mySqlTable("address", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").onUpdateNow(),

  longitude: float("longitude"),
  latitude: float("latitude"),
});
