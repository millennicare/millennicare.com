import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const Contact = pgTable("contact-us", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
});

export const insertContactSchema = createInsertSchema(Contact);
export const selectContactSchema = createSelectSchema(Contact);
