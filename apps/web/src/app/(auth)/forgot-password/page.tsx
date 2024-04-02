import ForgotPasswordForm from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 className="font-sans text-2xl">Forgot password</h1>
      <ForgotPasswordForm />
    </div>
  );
}
