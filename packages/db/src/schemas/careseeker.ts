import { relations } from "drizzle-orm";
import { index, pgTable, text } from "drizzle-orm/pg-core";

import { Child } from "./child";
import { User } from "./user";

export const Careseeker = pgTable(
  "careseekers",
  {
    userId: text("user_id")
      .unique()
      .references(() => User.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (careseeker) => ({
    userIdIdx: index("careseeker_userId_idx").on(careseeker.userId),
  }),
);

export const CareseekerRelations = relations(Careseeker, ({ many, one }) => ({
  children: many(Child),
  user: one(User, {
    fields: [Careseeker.userId],
    references: [User.id],
  }),
}));
