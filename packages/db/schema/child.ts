import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { int, timestamp, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { careseekers } from "./auth";

export const children = mySqlTable("child", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").onUpdateNow(),

  age: int("age").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const childRelations = relations(children, ({ one }) => ({
  careseeker: one(careseekers, {
    fields: [children.id],
    references: [careseekers.id],
  }),
}));