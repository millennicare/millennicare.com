import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { boolean, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

export const waitlists = mySqlTable("waitlist", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  contacted: boolean("contacted").default(false),
});
