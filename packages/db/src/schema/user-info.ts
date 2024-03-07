import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { date, index, text, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { userTable } from "./user";

export const userInfoTable = pgTable(
  "user_info",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .unique()
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
    biography: varchar("biography", { length: 255 }),
    profilePicture: text("profile_picture"),
    birthdate: date("birthdate", { mode: "date" }).notNull(),
    stripeId: text("stripe_id").notNull(),
  },
  (user) => ({
    stripeIdIdx: index("user_stripeId_idx").on(user.stripeId),
    userIdIdx: index("user_userId_idx").on(user.userId),
  }),
);

export const userInfoRelations = relations(userInfoTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userInfoTable.userId],
    references: [userTable.id],
  }),
}));