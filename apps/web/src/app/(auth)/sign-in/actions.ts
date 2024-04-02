"use server";

import { signInSchema } from "@millennicare/validators";
import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/server";
import { createSession } from "../../lib/auth";

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
    await createSession(response.id, validated.data.email);

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
