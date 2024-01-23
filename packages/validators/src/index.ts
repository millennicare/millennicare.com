import { createInsertSchema } from "drizzle-zod";
import validator from "validator";
import { z } from "zod";

import { schema } from "@millennicare/db";

export const createAddressSchema = createInsertSchema(schema.addresses, {
  zipCode: (schema) =>
    schema.zipCode.regex(/^\d{5}(?:[-\s]\d{4})?$/, {
      message: "Invalid zip code.",
    }),
});

export const createChildrenSchema = z.object({
  children: z.array(
    createInsertSchema(schema.children).pick({ name: true, age: true }),
  ),
});

export const createUserSchema = createInsertSchema(schema.users, {
  email: (schema) => schema.email.email(),
  password: (schema) =>
    schema.password
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,32}$/, // eslint-disable-line
        {
          message:
            "Password must be minimum 8 characters and at least one uppercase letter, one lowercase letter, and one number.",
        },
      )
      .min(8, { message: "Password must be between 8 and 32 characters." })
      .max(32, { message: "Password must be between 8 and 32 characters." }),
  phoneNumber: (schema) => schema.phoneNumber.refine(validator.isMobilePhone),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const createCareseekerSchema = createUserSchema.merge(
  z.object({
    children: createChildrenSchema,
    address: createAddressSchema,
  }),
);

export const createContactSchema = createInsertSchema(schema.contactUs, {
  email: (schema) => schema.email.email(),
}).omit({
  id: true,
  createdAt: true,
});
