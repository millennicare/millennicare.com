import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const Waitlist = pgTable("waitlists", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  contacted: boolean("contacted").default(false),
});
