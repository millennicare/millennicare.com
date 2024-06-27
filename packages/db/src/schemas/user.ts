import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Account } from "./account";
import { Address } from "./address";
import { EmailVerificationCode } from "./email-verification-code";
import { UserInfo } from "./user-info";

export const typeEnum = pgEnum("type", ["caregiver", "careseeker"]);

export const User = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  type: typeEnum("type").notNull(),
  onboardingComplete: boolean("onboarding_complete").default(false),
  emailVerified: boolean("email_verified").default(false),
});

export const UserRelations = relations(User, ({ many, one }) => ({
  accounts: many(Account),
  address: many(Address),
  userInfo: one(UserInfo),
  emailVerificationCode: one(EmailVerificationCode),
}));

export const insertUserSchema = createInsertSchema(User);
export const selectUserSchema = createSelectSchema(User);
