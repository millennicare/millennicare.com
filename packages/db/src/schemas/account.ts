import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { User } from "./user";

export const Account = pgTable(
  "accounts",
  {
    providerId: text("provider_id").notNull(),
    providerUserId: uuid("provider_user_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => User.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, {
    fields: [Account.userId],
    references: [User.id],
  }),
}));
