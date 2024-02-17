import type { StateCreator } from "zustand";
import { z } from "zod";

import { createUserSchema } from "@millennicare/validators";

export const passwordSchema = createUserSchema
  .pick({ password: true })
  .extend({
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
