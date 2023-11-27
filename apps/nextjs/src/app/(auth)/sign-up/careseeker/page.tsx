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
  zipCode: string;
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
  const [step, setStep] = useState(0);
  // States needed to track clerk verification
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();

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
    zipCode: "",
  });

  const { toast } = useToast();
  const mutation = api.user.careseekerRegister.useMutation();

  async function handleClerkSubmit() {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: formValues.email,
        password: formValues.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (error) {
      console.error("Error", JSON.stringify(error, null, 2));
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
      }

      const userId = completeSignUp.createdUserId;

      if (!userId) {
        console.log("user id not created");
        return;
      }
      await completeCareseekerRegistration(userId);
    } catch (error) {
      console.error("Error:", JSON.stringify(error, null, 2));
    }
  }

  async function completeCareseekerRegistration(userId: string) {
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
        id: userId,
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
      });
      router.push("/dashboard");
    } catch (error: any) {
      if (error.errors[0].message) {
        console.error("error", error.errors[0].message);
        toast({
          title: "Incorrect email or password.",
          variant: "destructive",
        });
      }
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
      void handleClerkSubmit();
      return;
    }
    setStep((prev) => prev + 1);
  }

  if (verifying) {
    return (
      <form onSubmit={handleVerify}>
        <label id="code">Code</label>
        <input
          value={code}
          id="code"
          name="code"
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Complete Sign Up</button>
      </form>
    );
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
