import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { Account } from "./account";
import { Address } from "./address";
import { UserInfo } from "./user-info";

export const typeEnum = pgEnum("type", ["caregiver", "careseeker", "admin"]);

export const User = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password"),
  type: typeEnum("type").notNull(),
  onboardingComplete: boolean("onboarding_complete").default(false),
});

export const UserRelations = relations(User, ({ many, one }) => ({
  accounts: many(Account),
  address: many(Address),
  userInfo: one(UserInfo),
}));
