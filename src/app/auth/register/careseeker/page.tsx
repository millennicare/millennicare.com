"use client";

import React, { useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";
import {
  PersonalInfoForm,
  WhoNeedsCareForm,
  AdditionalInfoForm,
} from "./forms";
import { uploadImage } from "~/app/_actions";

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
  profilePicture?: File;
  biography?: string;
  type: "careseeker";
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
  });

  const mutation = api.user.register.useMutation();

  // file upload to s3 isnt working
  // prisma errors when trying to upload
  async function submit() {
    let presignedUrl: string | undefined = undefined;
    if (formValues.profilePicture) {
      const formData = new FormData();
      formData.append("file", formValues.profilePicture);
      presignedUrl = await uploadImage(formData);

      console.log(presignedUrl);
    }
    const data = { ...formValues, profilePicture: presignedUrl };
    //const response = await mutation.mutateAsync(data);
    console.log(data);
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
      submit();
      return;
    }
    setStep((prev) => prev + 1);
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-palecream py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Image
            src="/millennicare_logo.png"
            alt="Workflow"
            height={85}
            width={85}
            priority={true}
          />
          <h2 className="font-mono text-xl">{titles[step]}</h2>
        </div>
        {/* @TODO: Stepper */}
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-2 py-4 shadow sm:rounded-lg sm:px-10">
          {displayStep(step)}
        </div>
      </div>
    </div>
  );
}
