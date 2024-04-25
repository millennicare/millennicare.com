"use server";

import type { createUserSchema } from "@millennicare/validators";
import type { z } from "zod";
import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

import { createSession } from "~/app/lib/auth";
import { api } from "~/trpc/server";

export const caregiverRegister = async (
  values: z.infer<typeof createUserSchema>,
) => {
  try {
    const { session } = await api.auth.register(values);
    await createSession(session);

    revalidatePath("/sign-up/caregiver");
  } catch (error) {
    console.error(error);
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }

    throw new Error("An error occurred, please try again later.");
  }
};
