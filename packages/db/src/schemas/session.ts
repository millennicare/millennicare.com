import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { User } from "./user";

export const Session = pgTable("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
