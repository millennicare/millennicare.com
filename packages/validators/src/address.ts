import { createInsertSchema } from "drizzle-zod";

import { schema } from "@millennicare/db";

export const createAddressSchema = createInsertSchema(schema.addresses, {
  zipCode: (schema) =>
    schema.zipCode.regex(/^\d{5}(?:[-\s]\d{4})?$/, {
      message: "Invalid zip code.",
    }),
});
