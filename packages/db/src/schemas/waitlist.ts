import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const Waitlist = pgTable("waitlists", {
  id: text("id").notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  contacted: boolean("contacted").default(false),
});
