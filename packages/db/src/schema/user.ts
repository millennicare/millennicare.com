import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgEnum, text, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { accountTable } from "./account";
import { addressTable } from "./address";

export const typeEnum = pgEnum("type", ["caregiver", "careseeker", "admin"]);

export const userTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }),
  type: typeEnum("type").notNull(),
});
export const userRelations = relations(userTable, ({ many }) => ({
  accounts: many(accountTable),
  address: many(addressTable),
}));
