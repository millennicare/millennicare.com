import { createInsertSchema, createSelectSchema } from "drizzle-zod";
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

export const createCareseekerSchema = createUserSchema.and(
  z.object({
    children: z.array(
      createInsertSchema(schema.children).omit({ userId: true }),
    ),
    address: createAddressSchema,
  }),
);

export const createContactSchema = z.object({
  email: z
    .string({
      required_error: "Email Required",
    })
    .email({ message: "Enter Valid Email" }),
  firstName: z
    .string({
      required_error: "First Name Required",
    })
    .min(2, { message: "Enter First Name" }),
  lastName: z
    .string({ required_error: "Last Name Required" })
    .min(2, { message: "Enter Last Name" }),
  phoneNumber: z
    .string()
    .refine(validator.isMobilePhone, { message: "Enter Valid Phone Number" })
    .optional(),
  message: z
    .string({ required_error: "Please Enter Message" })
    .min(2, { message: "Enter Message" }),
});
