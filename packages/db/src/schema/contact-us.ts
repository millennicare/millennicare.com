import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { text, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";

export const contactUs = mySqlTable("contact-us", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey()
    .unique(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),

  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
});
