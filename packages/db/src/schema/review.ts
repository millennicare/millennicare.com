import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { index, timestamp, tinyint, varchar } from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { caregivers, careseekers } from "./auth";

export const reviews = mySqlTable(
  "review",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey()
      .unique(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").onUpdateNow(),

    rating: tinyint("rating").notNull(),
    caregiverId: varchar("caregiverId", { length: 128 }).notNull(),
    careseekerId: varchar("careseekerId", { length: 128 }).notNull(),
  },
  (review) => ({
    caregiverIdIdx: index("caregiverId_idx").on(review.caregiverId),
    careseekerIdIdx: index("careseekerId_idx").on(review.careseekerId),
  }),
);

export const reviewRelations = relations(reviews, ({ one }) => ({
  caregiver: one(caregivers, {
    fields: [reviews.id],
    references: [caregivers.userId],
  }),
  careseeker: one(careseekers, {
    fields: [reviews.id],
    references: [careseekers.userId],
  }),
}));
