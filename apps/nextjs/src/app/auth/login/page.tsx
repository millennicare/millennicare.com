import { redirect } from "next/navigation";

import { auth } from "@millennicare/auth";

import LoginForm from "./form";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
