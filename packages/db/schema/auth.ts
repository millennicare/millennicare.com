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
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { addresses } from "./address";
import { children } from "./child";
import { forgotPasswordTokens } from "./forgot-password-token";
import { reviews } from "./review";

const userColumns = {
  // needed for next auth
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  // app specific fields
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  phoneNumber: varchar("password", { length: 255 }).notNull(),
  biography: varchar("biography", { length: 255 }),
  profilePicture: varchar("profilePicture", { length: 255 }),
  birthdate: datetime("birthdate", { mode: "string" }).notNull(),
  userType: mysqlEnum("userType", ["careseeker", "caregiver", "admin"]),
};

export const users = mySqlTable("user", {
  ...userColumns,

  caregiverId: varchar("caregiverId", { length: 128 }),
  careseekerId: varchar("careseekerId", { length: 128 }),
});

export const userRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  address: many(addresses),
  careseeker: one(careseekers, {
    fields: [users.id],
    references: [careseekers.id],
  }),
  caregiver: one(caregivers, {
    fields: [users.id],
    references: [caregivers.id],
  }),
  forgotPasswordToken: one(forgotPasswordTokens, {
    fields: [users.id],
    references: [forgotPasswordTokens.id],
  }),
}));

export const careseekers = mySqlTable("careseeker", {
  id: varchar("userId", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
});

export const careseekerRelations = relations(careseekers, ({ many }) => ({
  children: many(children),
  reviews: many(reviews),
}));

export const caregivers = mySqlTable("caregiver", {
  id: varchar("userId", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  backgroundCheckCompleted: boolean("background_check_completed").default(
    false,
  ),
});

export const caregiverRelations = relations(caregivers, ({ many }) => ({
  reviews: many(reviews),
}));

export const accounts = mySqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
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
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
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
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

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
