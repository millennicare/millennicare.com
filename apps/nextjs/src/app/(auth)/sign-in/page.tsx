import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import LoginForm from "./form";

export default function LoginPage() {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }
  return <LoginForm />;
}
