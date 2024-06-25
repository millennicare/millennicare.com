import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email()
    .min(1, { message: "Email is required" }),
  password: z.string({ required_error: "Password is required" }).min(1, {
    message: "Password is required",
  }),
});

// const phoneNumberRegex =
//   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{8,32}$/;

export const signUpSchema = z
  .object({
    type: z.enum(["caregiver", "careseeker"]),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be between 8 and 32 characters." })
      .max(32, { message: "Password must be between 8 and 32 characters." }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });

// export const signUpSchema = z
//   .object({
//     type: z.enum(["caregiver", "careseeker"]),
//     firstName: z.string({ required_error: "First name is required" }).min(1, {
//       message: "First name is required",
//     }),
//     lastName: z.string({ required_error: "Last name is required" }).min(1, {
//       message: "Last name is required",
//     }),
//     birthdate: z.date(),
//     gender: z.enum(["male", "female", "non-binary"]),
//     phoneNumber: z
//       .string({ required_error: "Phone number is required" })
//       .min(1, { message: "Phone number is required" })
//       .regex(phoneNumberRegex, {
//         message: "Invalid phone number format",
//       }),
//     email: z
//       .string({ required_error: "Email is required" })
//       .email()
//       .min(1, { message: "Email is required" }),
//     password: z
//       .string()
//       .regex(phoneNumberRegex, {
//         message:
//           "Password must be minimum 8 characters and at least one uppercase letter, one lowercase letter, and one number.",
//       })
//       .min(8, { message: "Password must be between 8 and 32 characters." })
//       .max(32, { message: "Password must be between 8 and 32 characters." }),
//     confirm: z.string(),
//   })
//   .refine((data) => data.password === data.confirm, {
//     path: ["confirm"],
//     message: "Passwords do not match.",
//   });
