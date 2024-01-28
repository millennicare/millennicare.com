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

export const createChildSchema = createInsertSchema(schema.children, {
  name: (schema) => schema.name.min(1, { message: "Name is required." }),
  age: (schema) =>
    schema.age
      .min(0, { message: "Age must be between 0 and 18." })
      .max(18, { message: "Age must be between 0 and 18." })
      .int(),
});

export const createUserSchema = createInsertSchema(schema.users, {
  email: (schema) => schema.email.email({ message: "Invalid email address." }),
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
  phoneNumber: (schema) =>
    schema.phoneNumber.refine(validator.isMobilePhone, {
      message: "Invalid phone number.",
    }),
  birthdate: (schema) =>
    schema.birthdate.refine(
      (birthdate) => {
        const ageDiffMs = Date.now() - birthdate.getTime();
        const ageDate = new Date(ageDiffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
      },
      {
        message: "You must be at least 18 years old to register.",
      },
    ),
}).omit({ id: true, createdAt: true, updatedAt: true, stripeId: true });

export const createCareseekerSchema = createUserSchema.extend({
  children: z
    .array(createChildSchema.pick({ name: true, age: true }))
    .min(1, { message: "At least one child is required to sign up." }),
  address: createAddressSchema.pick({ zipCode: true }),
});

export const createContactSchema = createInsertSchema(schema.contactUs, {
  email: (schema) => schema.email.email(),
}).omit({
  id: true,
  createdAt: true,
});
