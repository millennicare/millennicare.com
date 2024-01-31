import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { schema } from "@millennicare/db";

export const createChildSchema = createInsertSchema(schema.children, {
  name: (schema) => schema.name.min(1, { message: "Name is required." }),
  age: (schema) =>
    schema.age
      .min(0, { message: "Age must be between 0 and 18." })
      .max(18, { message: "Age must be between 0 and 18." })
      .int(),
});

export const selectChildSchema = createSelectSchema(schema.children);
