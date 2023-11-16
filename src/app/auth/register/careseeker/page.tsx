"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TRPCClientError } from "@trpc/client";

import { api } from "~/trpc/react";
import {
  PersonalInfoForm,
  WhoNeedsCareForm,
  AdditionalInfoForm,
} from "./forms";
import { useToast } from "~/components/ui/use-toast";

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
  type: "careseeker";
  locationId: string;
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
  const [step, setStep] = useState<number>(0);
  const [formValues, setFormValues] = useState<IUser>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthdate: new Date(),
    profilePicture: undefined,
    phoneNumber: "",
    type: "careseeker",
    children: [],
    locationId: "",
  });

  const { toast } = useToast();
  const mutation = api.user.careseekerRegister.useMutation();

  async function submit() {
    try {
      const response = await mutation.mutateAsync(formValues);
      toast({ title: response.message });

      //@TODO: redirect to /auth/verify-email
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast({
          title: "Uh-oh",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Uh-oh",
        description: "Something went wrong, please try again later.",
        variant: "destructive",
      });
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
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-palecream py-12 sm:px-6 lg:px-8">
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
