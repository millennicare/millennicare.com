import { createInsertSchema } from "drizzle-zod";
import validator from "validator";
import { z } from "zod";

import { schema } from "@millennicare/db";

const createAddressSchema = createInsertSchema(schema.addresses).omit({
  userId: true,
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
}).omit({ id: true });

export const createCareseekerSchema = createUserSchema.merge(
  z.object({
    children: z.array(
      createInsertSchema(schema.children, {
        age: (schema) => schema.age.min(0).max(18).int().positive(),
      }).pick({ name: true, age: true }),
    ),
    address: createAddressSchema,
  }),
);

export const createContactSchema = createInsertSchema(schema.contactUs, {
  email: (schema) => schema.email.email(),
}).omit({
  id: true,
  createdAt: true,
});
