import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { lucia } from "@millennicare/auth";
import { signInSchema } from "@millennicare/validators";

import type { ActionResult } from "~/app/@types/action-result";
import { api } from "~/trpc/server";
import SignInForm from "./sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 className="font-sans text-2xl">Welcome back</h1>
      <SignInForm signIn={signIn} />
    </div>
  );
}

export async function signIn(
  _: any,
  formData: FormData,
): Promise<ActionResult> {
  "use server";
  const data = signInSchema.parse(Object.fromEntries(formData));

  try {
    const { id, email } = await api.auth.login(data);
    const session = await lucia.createSession(id, { email });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    redirect("/dashboard");
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An error occurred" };
  }
}
