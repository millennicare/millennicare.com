"use client";

import { Progress } from "@millennicare/ui/progress";

import useFormStore from "../useFormStore";
import AdditionalInfoForm from "./additional-info-form";
import AddressForm from "./address-form";
import ChildrenForm from "./children-form";
import EmailForm from "./email-form";
import PasswordForm from "./password-form";

const formSteps = [
  "What's your email address?",
  "Tell us more about yourself",
  "Password setup",
  "Who needs care?",
  "Where are you located?",
];

export default function FormHandler() {
  const { step } = useFormStore((state) => state);

  function displayStep(currentStep: number) {
    switch (currentStep) {
      case 1:
        return <EmailForm />;
      case 2:
        return <AdditionalInfoForm />;
      case 3:
        return <PasswordForm />;
      case 4:
        return <ChildrenForm />;
      case 5:
        return <AddressForm />;
      default:
        return <div>None</div>;
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center space-y-4 md:w-1/2">
      <h1 className="text-center font-bold">{formSteps[step - 1]}</h1>
      <Progress value={(step / 6) * 100} className="w-2/3" />
      <span className="w-full rounded-lg border px-2 py-4">
        {displayStep(step)}
      </span>
    </div>
  );
}
