import { createId } from "@paralleldrive/cuid2";
import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const Waitlist = pgTable("waitlists", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  contacted: boolean("contacted").default(false),
});

export const insertWaitlistSchema = createInsertSchema(Waitlist).pick({
  email: true,
});

export const selectWaitlistSchema = createSelectSchema(Waitlist);
