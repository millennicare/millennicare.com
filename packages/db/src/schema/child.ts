import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { index, integer, text, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { careseekerTable } from "./careseeker";

export const childTable = pgTable(
  "children",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    age: integer("age").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => careseekerTable.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (child) => ({
    userIdIdx: index("child_userId_idx").on(child.userId),
  }),
);

export const childRelations = relations(childTable, ({ one }) => ({
  user: one(careseekerTable, {
    fields: [childTable.userId],
    references: [careseekerTable.userId],
  }),
}));
