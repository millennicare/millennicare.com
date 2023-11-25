"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import {
  AdditionalInfoForm,
  PersonalInfoForm,
  WhoNeedsCareForm,
} from "./forms";

export type IChild = {
  name: string;
  age: number;
};

export type IUser = {
  // first step
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  // second step
  children: IChild[];
  // third step
  birthdate: Date;
  profilePicture?: string;
  biography?: string;
  userType: "careseeker" | "caregiver" | "admin";
  longitude: number;
  latitude: number;
};

export type FormProps = {
  formValues: IUser;
  setFormValues: React.Dispatch<React.SetStateAction<IUser>>;
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const titles = [
  "Personal Information",
  "Who Needs Care?",
  "Additional Information",
];

export default function Page() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [step, setStep] = useState<number>(0);
  const [formValues, setFormValues] = useState<IUser>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthdate: new Date(),
    profilePicture: undefined,
    phoneNumber: "",
    userType: "careseeker",
    children: [],
    latitude: 0,
    longitude: 0,
  });

  const { toast } = useToast();
  const mutation = api.user.careseekerRegister.useMutation();

  async function submit() {
    if (!isLoaded) {
      console.log("not loaded");
      return null;
    }

    try {
      const res = await signUp.create({
        emailAddress: formValues.email,
        password: formValues.password,
      });

      const id = res.createdUserId;

      if (!id) {
        // some error occurred
        return;
      }
      // after user has been created in clerk, initiate registration process
      // in backend
      await mutation.mutateAsync({
        id: id,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        birthdate: formValues.birthdate,
        profilePicture: formValues.profilePicture,
        phoneNumber: formValues.phoneNumber,
        userType: "careseeker",
        children: formValues.children,
        latitude: formValues.latitude,
        longitude: formValues.longitude,
      });

      await setActive({ session: res.createdSessionId });
      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === 422) {
        toast({
          title: "Please use a more secure password",
          variant: "destructive",
        });
      }
      console.log(error);
    }
  }

  function displayStep(step: number) {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm
            formValues={formValues}
            setFormValues={setFormValues}
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 1:
        return (
          <WhoNeedsCareForm
            formValues={formValues}
            setFormValues={setFormValues}
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      case 2:
        return (
          <AdditionalInfoForm
            formValues={formValues}
            setFormValues={setFormValues}
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
          />
        );
      default:
        console.log("no step");
    }
  }

  function handleBack() {
    if (step !== 0) setStep((prev) => prev - 1);
  }

  function handleNext() {
    if (step === 2) {
      void submit();
      return;
    }
    setStep((prev) => prev + 1);
  }

  return (
    <div className="bg-palecream flex min-h-screen flex-col items-center justify-center space-y-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Image
            src="/millennicare_logo.png"
            alt="Workflow"
            height={85}
            width={85}
            priority={true}
          />
          <h2 className="text-xl">{titles[step]}</h2>
        </div>
        {/* @TODO: Stepper */}
      </div>

      <div className="w-2/5 rounded-lg bg-white px-4 py-3 shadow">
        {displayStep(step)}
      </div>
    </div>
  );
}
