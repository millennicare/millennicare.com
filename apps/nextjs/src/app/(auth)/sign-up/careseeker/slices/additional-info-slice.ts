import { StateCreator } from "zustand";

type AdditionalInfo = {
  profilePicture: string | null | undefined;
  phoneNumber: string;
  birthdate: Date;
  biography: string | undefined;
  address: {
    zipCode: string;
  };
};

type AdditionalInfoSlice = {
  additionalInfo: AdditionalInfo;
  setAdditionalInfo: (data: AdditionalInfo) => void;
};

const initialState = {
  profilePicture: undefined,
  birthdate: new Date(),
  biography: undefined,
  phoneNumber: "",
  address: {
    zipCode: "",
  },
};

const createAdditionalInfoSlice: StateCreator<AdditionalInfoSlice> = (set) => ({
  additionalInfo: initialState,
  setAdditionalInfo: (data) =>
    set((state) => ({ additionalInfo: { ...state.additionalInfo, ...data } })),
});

export default createAdditionalInfoSlice;
export type { AdditionalInfo, AdditionalInfoSlice };
