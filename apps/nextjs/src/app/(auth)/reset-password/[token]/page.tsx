import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 className="font-sans text-2xl">Reset password</h1>
      <ResetPasswordForm />
    </div>
  );
}
