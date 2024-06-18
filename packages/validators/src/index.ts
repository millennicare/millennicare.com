import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .email()
    .min(1, { message: "Email is required" }),
  password: string({ required_error: "Password is required" }).min(1, {
    message: "Password is required",
  }),
});

export const signUpSchema = object({
  email: string({ required_error: "Email is required" })
    .email()
    .min(1, { message: "Email is required" }),
  password: string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,32}$/, // eslint-disable-line
      {
        message:
          "Password must be minimum 8 characters and at least one uppercase letter, one lowercase letter, and one number.",
      },
    )
    .min(8, { message: "Password must be between 8 and 32 characters." })
    .max(32, { message: "Password must be between 8 and 32 characters." }),
  confirm: string(),
}).refine((data) => data.password === data.confirm, {
  path: ["confirm"],
  message: "Passwords do not match",
});
