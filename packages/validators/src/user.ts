import { z } from "zod";

export const typeEnum = z.enum(["caregiver", "careseeker", "admin"]);

export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,32}$/, // eslint-disable-line
      {
        message:
          "Password must be minimum 8 characters and at least one uppercase letter, one lowercase letter, and one number.",
      },
    )
    .min(8, { message: "Password must be between 8 and 32 characters." })
    .max(32, { message: "Password must be between 8 and 32 characters." })
    .nullish(),
  type: typeEnum,
});

export const selectUserSchema = createUserSchema.extend({
  id: z.string().cuid2(),
});

export const updateUserSchema = selectUserSchema
  .partial()
  .required({ id: true });

export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
