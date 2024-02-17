import { relations } from "drizzle-orm";
import { boolean, index, text } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { serviceTable } from "./service";
import { userTable } from "./user";

export const caregiverTable = pgTable(
  "caregivers",
  {
    userId: text("user_id")
      .unique()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    backgroundCheckCompleted: boolean("background_check_completed")
      .default(false)
      .notNull(),
  },
  (caregiverTable) => ({
    userIdIdx: index("caregiver_userId_idx").on(caregiverTable.userId),
  }),
);

export const caregiverRelations = relations(
  caregiverTable,
  ({ many, one }) => ({
    services: many(serviceTable),
    user: one(userTable, {
      fields: [caregiverTable.userId],
      references: [userTable.id],
    }),
  }),
);
