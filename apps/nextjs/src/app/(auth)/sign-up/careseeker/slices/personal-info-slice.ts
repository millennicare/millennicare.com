import { StateCreator } from "zustand";

type PersonalInfo = {
  email: string;
  password: string;
};

type PersonalInfoSlice = {
  personalInfo: PersonalInfo;
  setPersonalInfo: (data: PersonalInfo) => void;
};

const initialState = {
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
