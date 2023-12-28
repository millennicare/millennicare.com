import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { caregivers, careseekers, users } from "../schema/auth";

export const selectUserSchema = createSelectSchema(users);
export const selectCaregiverSchema = createSelectSchema(caregivers);
export const selectCareseekerSchema = createSelectSchema(careseekers);

export const insertUserSchema = createInsertSchema(users);
export const insertCaregiverSchema = createInsertSchema(caregivers);
export const insertCareseekerSchema = createInsertSchema(careseekers);
