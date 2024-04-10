"use server";

import { signInSchema } from "@millennicare/validators";
import { TRPCError } from "@trpc/server";

import { createSession } from "~/app/lib/auth";
import { api } from "~/trpc/server";

export const signIn = async (
  prev: unknown,
  formData: FormData,
): Promise<{ message: string; error?: boolean }> => {
  console.log(prev);
  try {
    const values = Object.fromEntries(formData.entries());
    const validated = signInSchema.safeParse(values);

    if (!validated.success) {
      return { message: "Invalid fields", error: true };
    }

    const response = await api.auth.login(validated.data);
    await createSession(response.cookie);

    return { message: "Going to dashboard!", error: false };
  } catch (error) {
    if (error instanceof TRPCError) {
      return { message: error.message, error: true };
    }
    return {
      message: "An error occurred, please try again later.",
      error: true,
    };
  }
};
