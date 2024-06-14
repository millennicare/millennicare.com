import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const Contact = pgTable("contact-us", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
});
