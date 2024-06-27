import { relations } from "drizzle-orm";
import { index, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Careseeker } from "./careseeker";

export const Child = pgTable(
  "children",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    age: integer("age").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: uuid("user_id")
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
export const selectChildSchema = createSelectSchema(Child);
