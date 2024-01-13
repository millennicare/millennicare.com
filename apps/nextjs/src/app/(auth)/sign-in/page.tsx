import { redirect } from "next/navigation";

import { getSession } from "~/app/actions";
import SignInForm from "./sign-in-form";

export default async function SignInPage() {
  const session = await getSession();

  if (session.isLoggedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 className="font-sans text-2xl">Welcome back</h1>
      <SignInForm />
    </div>
  );
}
