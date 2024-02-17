import type { z } from "zod";
import type { StateCreator } from "zustand";

import { createUserInfoSchema } from "@millennicare/validators";

export const additionalInfoSchema = createUserInfoSchema.pick({
  name: true,
  phoneNumber: true,
});

type AdditionalInfo = z.infer<typeof additionalInfoSchema>;

type AdditionalInfoSlice = {
  additionalInfo: AdditionalInfo;
  setAdditionalInfo: (data: AdditionalInfo) => void;
};

const intialState: AdditionalInfo = {
  name: "",
  phoneNumber: "",
};

const createAdditionalInfoSlice: StateCreator<AdditionalInfoSlice> = (set) => ({
  additionalInfo: intialState,
  setAdditionalInfo: (data) => set({ additionalInfo: data }),
});

export default createAdditionalInfoSlice;
export type { AdditionalInfo, AdditionalInfoSlice };
