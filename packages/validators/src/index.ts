import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .email()
    .min(1, { message: "Email is required" }),
  password: string({ required_error: "Password is required" }).min(1, {
    message: "Password is required",
  }),
});
