import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const Waitlist = pgTable("waitlists", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  contacted: boolean("contacted").default(false),
});

export const insertWaitlistSchema = createInsertSchema(Waitlist).pick({
  email: true,
});

export const selectWaitlistSchema = createSelectSchema(Waitlist);
