import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  mysqlEnum,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { addresses } from "./address";
import { children } from "./child";
import { forgotPasswordTokens } from "./forgot-password-token";
import { reviews } from "./review";

export const users = mySqlTable(
  "user",
  {
    // needed for next auth
    id: varchar("id", { length: 128 }).primaryKey(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    // app specific fields
    firstName: varchar("firstName", { length: 255 }).notNull(),
    lastName: varchar("lastName", { length: 255 }).notNull(),
    phoneNumber: varchar("phoneNumber", { length: 255 }).notNull(),
    biography: varchar("biography", { length: 255 }),
    profilePicture: varchar("profilePicture", { length: 255 }),
    birthdate: datetime("birthdate", { mode: "date" }).notNull(),
    userType: mysqlEnum("userType", [
      "careseeker",
      "caregiver",
      "admin",
    ]).notNull(),
    forgotPasswordTokenId: varchar("forgot_password_token_id", { length: 128 }),
  },
  (user) => ({
    forgotPasswordTokenIdx: index("forgotPasswordTokenId_idx").on(
      user.forgotPasswordTokenId,
    ),
  }),
);

export const userRelations = relations(users, ({ many, one }) => ({
  address: many(addresses),
  forgotPasswordToken: one(forgotPasswordTokens, {
    fields: [users.id],
    references: [forgotPasswordTokens.id],
  }),
}));

export const careseekers = mySqlTable("careseeker", {
  userId: varchar("user_id", { length: 128 }).unique().primaryKey(),
});

export const careseekerRelations = relations(careseekers, ({ many }) => ({
  children: many(children),
  reviews: many(reviews),
}));

export const caregivers = mySqlTable("caregiver", {
  userId: varchar("user_id", { length: 128 }).unique().primaryKey(),
  backgroundCheckCompleted: boolean("background_check_completed").default(
    false,
  ),
});

export const caregiverRelations = relations(caregivers, ({ many }) => ({
  reviews: many(reviews),
}));
