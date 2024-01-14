import { z } from "zod";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createCareseekerSchema } from "@millennicare/validators";

export type CareseekerSignUp = z.infer<typeof createCareseekerSchema>;

interface FormState {
  formData: CareseekerSignUp;
  setFormData: (data: CareseekerSignUp) => void;
}

const initialState: CareseekerSignUp = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  biography: undefined,
  profilePicture: undefined,
  birthdate: new Date(),
  userType: "careseeker",
  children: [{ name: "", age: 0 }],
  address: { zipCode: "", longitude: 0, latitude: 0 },
};

export const useFormState = create<FormState>()(
  devtools(
    persist(
      (set) => ({
        formData: initialState,
        setFormData: (data) =>
          set((state) => ({ formData: { ...state.formData, ...data } })),
      }),
      {
        name: "careseeker-sign-up-form-store",
      },
    ),
  ),
);
