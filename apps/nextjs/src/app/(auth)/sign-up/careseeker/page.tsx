"use client";

import FormHandler from "./forms/form-handler";

export default function CareseekerSignUpPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4 px-4 py-6">
      <h1>Careseeker sign up</h1>

      <span className="w-full max-w-md rounded-lg border md:w-1/2">
        <FormHandler />
      </span>
    </div>
  );
}
