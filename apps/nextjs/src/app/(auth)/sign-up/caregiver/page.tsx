import RegisterForm from "./form";

export default function CaregiverSignUpPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1 className="font-sans text-2xl">Create an account</h1>
      <RegisterForm />
    </div>
  );
}
