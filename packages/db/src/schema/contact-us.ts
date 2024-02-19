import { createId } from "@paralleldrive/cuid2";
import { text, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";

export const contactTable = pgTable("contact-us", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
});
