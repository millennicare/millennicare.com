import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  mysqlEnum,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { mySqlTable } from "./_table";
import { addresses } from "./address";
import { children } from "./child";
import { reviews } from "./review";
import { services } from "./service";

export const users = mySqlTable("user", {
  // needed for next auth
  id: varchar("id", { length: 128 }).primaryKey(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  // app specific fields
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 255 }).notNull(),
  biography: varchar("biography", { length: 255 }),
  profilePicture: varchar("profilePicture", { length: 500 }),
  birthdate: datetime("birthdate", { mode: "date" }).notNull(),
  userType: mysqlEnum("userType", [
    "careseeker",
    "caregiver",
    "admin",
  ]).notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  address: many(addresses),
}));

export const careseekers = mySqlTable(
  "careseeker",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 128 }).unique().notNull(),
  },
  (careseeker) => ({
    userIdIdx: index("userId_idx").on(careseeker.userId),
  }),
);

export const careseekerRelations = relations(careseekers, ({ many }) => ({
  children: many(children),
  reviews: many(reviews),
}));

export const caregivers = mySqlTable(
  "caregiver",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 128 }).unique().notNull(),
    backgroundCheckCompleted: boolean("background_check_completed")
      .default(false)
      .notNull(),
    stripeId: varchar("stripe_id", { length: 255 }).notNull(),
  },
  (caregiver) => ({
    userIdIdx: index("userId_idx").on(caregiver.userId),
    stripeIdIdx: index("stripeId_idx").on(caregiver.stripeId),
  }),
);

export const caregiverRelations = relations(caregivers, ({ many }) => ({
  reviews: many(reviews),
  services: many(services),
}));
