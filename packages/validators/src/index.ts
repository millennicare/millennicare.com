import validator from "validator";
import { z } from "zod";

export const CreateContactSchema = z.object({
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
