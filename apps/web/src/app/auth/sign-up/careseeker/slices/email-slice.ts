import type { z } from "zod";
import type { StateCreator } from "zustand";

import { createUserSchema } from "@millennicare/validators";

export const emailSchema = createUserSchema.pick({
  email: true,
});

type Email = z.infer<typeof emailSchema>;

interface EmailSlice {
  email: Email;
  setEmail: (data: Email) => void;
}

const initialState: Email = {
  email: "",
};

const createEmailInfoSlice: StateCreator<EmailSlice> = (set) => ({
  email: initialState,
  setEmail: (data) => set({ email: data }),
});

export default createEmailInfoSlice;
export type { Email, EmailSlice };
