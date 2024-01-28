import { z } from "zod";
import { StateCreator } from "zustand";

import { createCareseekerSchema } from "@millennicare/validators";

export const personalInfoSchema = createCareseekerSchema.pick({
  email: true,
  password: true,
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;

type PersonalInfoSlice = {
  personalInfo: PersonalInfo;
  setPersonalInfo: (data: PersonalInfo) => void;
};

const initialState: PersonalInfo = {
  email: "",
  password: "",
};

const createPersonalInfoSlice: StateCreator<PersonalInfoSlice> = (set) => ({
  personalInfo: initialState,
  setPersonalInfo: (data) =>
    set((state) => ({ personalInfo: { ...state.personalInfo, ...data } })),
});

export default createPersonalInfoSlice;
export type { PersonalInfo, PersonalInfoSlice };
