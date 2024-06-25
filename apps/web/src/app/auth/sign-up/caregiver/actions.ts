"use server";

import type { z } from "zod";
import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

import type { signUpSchema } from "@millennicare/validators";

import { createSessionCookie } from "~/app/lib/auth";
import { api } from "~/trpc/server";

type CaregiverRegisterValues = z.infer<typeof signUpSchema>;

export const caregiverRegister = async (values: CaregiverRegisterValues) => {
  try {
    const { session } = await api.auth.register(values);
    createSessionCookie(session);

    revalidatePath("/sign-up/caregiver");
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }

    throw new Error("An error occurred, please try again later.");
  }
};
