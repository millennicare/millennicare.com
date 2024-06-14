import type { z } from "zod";
import type { StateCreator } from "zustand";

import { createAddressSchema } from "@millennicare/validators";

export const addressSchema = createAddressSchema.omit({
  userId: true,
  longitude: true,
  latitude: true,
});

type Address = z.infer<typeof addressSchema>;

type AddressSlice = {
  address: Address;
  setAddress: (data: Address) => void;
};

const initialState: Address = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  zipCode: "",
  placeId: "",
};

export const createAddressInfoSlice: StateCreator<AddressSlice> = (set) => ({
  address: initialState,
  setAddress: (data) => set({ address: data }),
});

export default createAddressInfoSlice;
export type { Address, AddressSlice };
