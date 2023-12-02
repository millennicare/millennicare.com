"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import {
  AdditionalInfoForm,
  PersonalInfoForm,
  VerifyForm,
  WhoNeedsCareForm,
} from "./forms";
import type { IUser } from "./types";

const titles = [
  "Personal Information",
  "Who Needs Care?",
  "Additional Information",
  "Verify Your Email",
];

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const userIdRef = useRef("");
  const { isLoaded, signUp } = useSignUp();

  const [formValues, setFormValues] = useState<IUser>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthdate: new Date(),
    profilePicture: undefined,
    phoneNumber: "",
    userType: "careseeker",
    children: [],
    zipCode: "",
  });

  const { toast } = useToast();
  const mutation = api.careseeker.careseekerRegister.useMutation();

  function displayStep(currentStep: number) {
    switch (currentStep) {
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
            handleClerkSubmit={handleClerkSubmit}
          />
        );
      case 3:
        return (
          <VerifyForm
            formValues={formValues}
            setFormValues={setFormValues}
            handleBack={handleBack}
            handleNext={handleNext}
            step={step}
            userIdRef={userIdRef}
            handleClerkSubmit={handleClerkSubmit}
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
    if (step === 3) {
      void finishRegister();
      return;
    }
    setStep((prev) => prev + 1);
  }

  async function handleClerkSubmit(retry?: boolean) {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: formValues.email,
        password: formValues.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      if (!retry) {
        handleNext();
      }
    } catch (error) {
      toast({
        title: "Uh-oh, something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  async function finishRegister() {
    try {
      const locationRes = await fetch("/api/locations/get-details", {
        method: "POST",
        body: JSON.stringify({ zipCode: formValues.zipCode }),
      });

      if (!locationRes.ok) {
        toast({
          title: "Something went wrong.",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }
      const { coordinates } = (await locationRes.json()) as {
        coordinates: {
          latitude: number;
          longitude: number;
        };
      };
      await mutation.mutateAsync({
        id: userIdRef.current,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        birthdate: formValues.birthdate,
        profilePicture: formValues.profilePicture,
        phoneNumber: formValues.phoneNumber,
        userType: "careseeker",
        children: formValues.children,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        zipCode: formValues.zipCode,
      });

      toast({
        title: "Success!",
        description: "Going to dashboard.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="bg-palecream flex min-h-screen flex-col items-center justify-center space-y-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Image
            src="/millennicare_logo.png"
            alt="MillenniCare logo"
            height={96}
            width={96}
            priority={true}
          />
          <h2 className="text-xl">{titles[step]}</h2>
        </div>
        {/* @TODO: Stepper */}
      </div>

      <div className="rounded-lg bg-white px-4 py-3 shadow sm:max-w-md">
        {displayStep(step)}
      </div>
    </div>
  );
}
