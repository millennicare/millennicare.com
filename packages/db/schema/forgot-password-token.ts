import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { bigint, index, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { users } from "./auth";

export const forgotPasswordTokens = mySqlTable(
  "forgot_password_token",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: varchar("userId", { length: 128 })
      .notNull()
      .references(() => users.id),
    expiresIn: bigint("expiresIn", { mode: "number" }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
  },
  (forgotPasswordToken) => ({
    userIdIdx: index("userId_idx").on(forgotPasswordToken.userId),
  }),
);

export const forgotPasswordTokenRelations = relations(
  forgotPasswordTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [forgotPasswordTokens.id],
      references: [users.id],
    }),
  }),
);
