import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Careseeker } from "./careseeker";

export const Child = pgTable(
  "children",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
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

export const insertChildSchema = createInsertSchema(Child);
export const selectChildschema = createSelectSchema(Child);
