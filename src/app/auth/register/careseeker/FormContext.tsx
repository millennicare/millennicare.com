"use client";

import { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type IUser = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: Date;
  profilePicture: string;
  phoneNumber: string;
  type: "careseeker";
};

type CareseekerContextType = {
  formValues: IUser;
  setFormValues: React.Dispatch<React.SetStateAction<IUser>>;
};

export const FormContext = createContext<CareseekerContextType | null>(null);

export const initialValues: IUser = {
  firstName: "",
  middleName: undefined,
  lastName: "",
  email: "",
  password: "",
  birthdate: new Date(),
  profilePicture: "",
  phoneNumber: "",
  type: "careseeker",
};

export default function FormContextProvider({ children }: Props) {
  const [formValues, setFormValues] = useState<IUser>(initialValues);

  return (
    <FormContext.Provider value={{ formValues, setFormValues }}>
      {children}
    </FormContext.Provider>
  );
}
