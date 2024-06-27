import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { User } from "./user";

export const EmailVerificationCode = pgTable("email_verification_codes", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  code: text("code").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const EmailVerificationCodeRelations = relations(
  EmailVerificationCode,
  ({ one }) => ({
    user: one(User, {
      fields: [EmailVerificationCode.userId],
      references: [User.id],
    }),
  }),
);
