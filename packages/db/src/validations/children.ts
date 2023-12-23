import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { children } from "../schema/child";

export const selectChildrenSchema = createSelectSchema(children);

export const insertChldrenSchema = createInsertSchema(children);
