import { createId } from "@paralleldrive/cuid2";
import { boolean, text, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";

export const waitlistTable = pgTable("waitlists", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  contacted: boolean("contacted").default(false),
});
