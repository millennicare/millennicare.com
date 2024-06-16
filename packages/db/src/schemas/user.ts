import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Account } from "./account";
import { Address } from "./address";
import { UserInfo } from "./user-info";

export const typeEnum = pgEnum("type", ["caregiver", "careseeker", "admin"]);

export const User = pgTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),

  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  type: typeEnum("type").notNull(),
  onboardingComplete: boolean("onboarding_complete").default(false),
});

export const UserRelations = relations(User, ({ many, one }) => ({
  accounts: many(Account),
  address: many(Address),
  userInfo: one(UserInfo),
}));

export const insertUserSchema = createInsertSchema(User);
export const selectUserSchema = createSelectSchema(User);
