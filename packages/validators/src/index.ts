import { object, string, z } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .email()
    .min(1, { message: "Email is required" }),
  password: string({ required_error: "Password is required" }).min(1, {
    message: "Password is required",
  }),
});

const phoneNumberRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{8,32}$/;

export const signUpSchema = object({
  type: z.enum(["caregiver", "careseeker"]),
  firstName: string({ required_error: "First name is required" }).min(1, {
    message: "First name is required",
  }),
  lastName: string({ required_error: "Last name is required" }).min(1, {
    message: "Last name is required",
  }),
  phoneNumber: string().regex(phoneNumberRegex, {
    message: "Invalid phone number format",
  }),
  email: string({ required_error: "Email is required" })
    .email()
    .min(1, { message: "Email is required" }),
  password: string()
    .regex(phoneNumberRegex, {
      message:
        "Password must be minimum 8 characters and at least one uppercase letter, one lowercase letter, and one number.",
    })
    .min(8, { message: "Password must be between 8 and 32 characters." })
    .max(32, { message: "Password must be between 8 and 32 characters." }),
  confirm: string(),
}).refine((data) => data.password === data.confirm, {
  path: ["confirm"],
  message: "Passwords do not match",
});
