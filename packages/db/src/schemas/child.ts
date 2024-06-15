import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { Careseeker } from "./careseeker";

export const Child = pgTable(
  "children",
  {
    id: text("id").notNull().primaryKey(),
    age: integer("age").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => Careseeker.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (child) => ({
    userIdIdx: index("child_userId_idx").on(child.userId),
  }),
);

export const childRelations = relations(Child, ({ one }) => ({
  user: one(Careseeker, {
    fields: [Child.userId],
    references: [Careseeker.userId],
  }),
}));
