import { relations } from "drizzle-orm";
import { boolean, index, pgTable, uuid } from "drizzle-orm/pg-core";

import { Service } from "./service";
import { User } from "./user";

export const Caregiver = pgTable(
  "caregivers",
  {
    userId: uuid("user_id")
      .unique()
      .references(() => User.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    backgroundCheckCompleted: boolean("background_check_completed")
      .default(false)
      .notNull(),
  },
  (caregiver) => ({
    userIdIdx: index("caregiver_userId_idx").on(caregiver.userId),
  }),
);

export const caregiverRelations = relations(Caregiver, ({ many, one }) => ({
  services: many(Service),
  user: one(User, {
    fields: [Caregiver.userId],
    references: [User.id],
  }),
}));
