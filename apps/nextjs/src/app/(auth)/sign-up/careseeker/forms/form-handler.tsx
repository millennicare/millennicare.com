"use client";

import useFormStore from "../useFormStore";
import ChildrenForm from "./children-form";
import PersonalInfoForm from "./personal-info";

export default function FormHandler() {
  const step = useFormStore((state) => state.step);

  console.log(step);
  function displayStep(currentStep: number) {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <ChildrenForm />;
      default:
        return <div>None</div>;
    }
  }

  return <div>{displayStep(step)}</div>;
}
