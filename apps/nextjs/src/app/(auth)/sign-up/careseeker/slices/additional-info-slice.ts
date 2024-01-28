import { z } from "zod";
import { StateCreator } from "zustand";

import { createCareseekerSchema } from "@millennicare/validators";

export const additionalInfoSchema = createCareseekerSchema.pick({
  firstName: true,
  lastName: true,
  profilePicture: true,
  phoneNumber: true,
  birthdate: true,
  address: true,
  userType: true,
});

type AdditionalInfo = z.infer<typeof additionalInfoSchema>;

type AdditionalInfoSlice = {
  additionalInfo: AdditionalInfo;
  setAdditionalInfo: (data: AdditionalInfo) => void;
};

const initialState: AdditionalInfo = {
  firstName: "",
  lastName: "",
  profilePicture: undefined,
  birthdate: new Date(),
  phoneNumber: "",
  address: {
    zipCode: "",
  },
  userType: "careseeker",
};

const createAdditionalInfoSlice: StateCreator<AdditionalInfoSlice> = (set) => ({
  additionalInfo: initialState,
  setAdditionalInfo: (data) =>
    set((state) => ({ additionalInfo: { ...state.additionalInfo, ...data } })),
});

export default createAdditionalInfoSlice;
export type { AdditionalInfo, AdditionalInfoSlice };
