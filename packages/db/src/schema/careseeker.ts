import { relations } from "drizzle-orm";
import { index, text } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { childTable } from "./child";
import { userTable } from "./user";

export const careseekerTable = pgTable(
  "careseekers",
  {
    userId: text("user_id")
      .unique()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (careseeker) => ({
    userIdIdx: index("careseeker_userId_idx").on(careseeker.userId),
  }),
);

export const careseekerRelations = relations(
  careseekerTable,
  ({ many, one }) => ({
    children: many(childTable),
    user: one(userTable, {
      fields: [careseekerTable.userId],
      references: [userTable.id],
    }),
  }),
);
