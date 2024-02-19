import validator from "validator";
import { z } from "zod";

export const createUserInfoSchema = z.object({
  userId: z.string().cuid2(),
  name: z.string(),
  phoneNumber: z.string().refine(validator.isMobilePhone, {
    message: "Invalid phone number",
  }),
  birthdate: z.coerce.date().refine(
    (birthdate) => {
      const ageDiffMs = Date.now() - new Date(birthdate).getTime();
      const ageDate = new Date(ageDiffMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
    },
    {
      message: "You must be at least 18 years old to register.",
    },
  ),
  biography: z.string().nullish(),
  profilePicture: z.string().nullish(),
});

export const selectUserInfoSchema = createUserInfoSchema;
export const updateUserInfoSchema = selectUserInfoSchema
  .partial()
  .required({ userId: true });

export type UserInfo = z.infer<typeof selectUserInfoSchema>;
export type UpdateUserInfo = z.infer<typeof updateUserInfoSchema>;
