import { StateCreator } from "zustand";

type AdditionalInfo = {
  firstName: string;
  lastName: string;
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
  firstName: "",
  lastName: "",
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
