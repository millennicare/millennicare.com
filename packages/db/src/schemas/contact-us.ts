import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const Contact = pgTable("contact-us", {
  id: text("id").notNull().primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
});
