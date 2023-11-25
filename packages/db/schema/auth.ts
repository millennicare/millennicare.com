import type { AdapterAccount } from "@auth/core/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  int,
  mysqlEnum,
  primaryKey,
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
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
      fsp: 3,
    }).default(sql`CURRENT_TIMESTAMP(3)`),
    // app specific fields
    firstName: varchar("firstName", { length: 255 }).notNull(),
    lastName: varchar("lastName", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
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
  accounts: many(accounts),
  address: many(addresses),
  forgotPasswordToken: one(forgotPasswordTokens, {
    fields: [users.id],
    references: [forgotPasswordTokens.id],
  }),
}));

export const careseekers = mySqlTable(
  "careseeker",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 128 }).unique(),
  },
  (careseeker) => ({
    userIdIdx: index("userId_idx").on(careseeker.userId),
  }),
);

export const careseekerRelations = relations(careseekers, ({ many }) => ({
  children: many(children),
  reviews: many(reviews),
}));

export const caregivers = mySqlTable(
  "caregiver",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 128 }).unique(),
    backgroundCheckCompleted: boolean("background_check_completed").default(
      false,
    ),
  },
  (caregiver) => ({
    userIdIdx: index("userId_idx").on(caregiver.userId),
  }),
);

export const caregiverRelations = relations(caregivers, ({ many }) => ({
  reviews: many(reviews),
}));

export const accounts = mySqlTable(
  "account",
  {
    userId: varchar("user_id", { length: 128 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = mySqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 128 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const verificationTokens = mySqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
