import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  doublePrecision,
  index,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { User } from "./user";

export const Address = pgTable(
  "addresses",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    line1: varchar("line1", { length: 128 }).notNull(),
    line2: varchar("line2", { length: 128 }),
    city: varchar("city", { length: 128 }).notNull(),
    state: varchar("state", { length: 128 }).notNull(),
    zipCode: varchar("zip_code", { length: 128 }).notNull(),
    longitude: doublePrecision("longitude").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    placeId: text("place_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => User.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (address) => ({
    userIdIdx: index("address_userId_idx").on(address.userId),
  }),
);

export const AddressRelations = relations(Address, ({ one }) => ({
  user: one(User, {
    fields: [Address.userId],
    references: [User.id],
  }),
}));

export const insertAddressSchema = createInsertSchema(Address);
export const selectAddressSchema = createSelectSchema(Address);
