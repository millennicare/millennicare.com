import type { StateCreator } from "zustand";
import { z } from "zod";

export const passwordSchema = z
  .object({
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
      .max(32, { message: "Password must be between 8 and 32 characters." }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type Password = z.infer<typeof passwordSchema>;

type PasswordSlice = {
  password: Password;
  setPassword: (data: Password) => void;
};

const initialState: Password = {
  password: "",
  confirm: "",
};

export const createPasswordInfoSlice: StateCreator<PasswordSlice> = (set) => ({
  password: initialState,
  setPassword: (data) => set({ password: data }),
});

export default createPasswordInfoSlice;
export type { Password, PasswordSlice };
