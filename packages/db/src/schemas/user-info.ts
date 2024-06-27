import { relations } from "drizzle-orm";
import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { User } from "./user";

export const genderEnum = pgEnum("gender", ["male", "female", "non-binary"]);

export const UserInfo = pgTable(
  "user_info",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => User.id, {
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
    gender: genderEnum("gender"),
    stripeId: text("stripe_id").notNull(),
  },
  (user) => ({
    stripeIdIdx: index("user_stripeId_idx").on(user.stripeId),
    userIdIdx: index("user_userId_idx").on(user.userId),
  }),
);

export const userInfoRelations = relations(UserInfo, ({ one }) => ({
  user: one(User, {
    fields: [UserInfo.userId],
    references: [User.id],
  }),
}));

export const insertUserInfoSchema = createInsertSchema(UserInfo);
export const selectUserInfoSchema = createSelectSchema(UserInfo);
