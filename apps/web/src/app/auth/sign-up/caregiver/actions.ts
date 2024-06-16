"use server";

import type { z } from "zod";
import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

import type { insertUserSchema } from "@millennicare/db/schema";

import { createSessionCookie } from "~/app/lib/auth";
import { api } from "~/trpc/server";

export const caregiverRegister = async (
  values: z.infer<typeof insertUserSchema>,
) => {
  try {
    const { session } = await api.auth.register(values);
    await createSessionCookie(session);

    revalidatePath("/sign-up/caregiver");
  } catch (error) {
    console.error(error);
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }

    throw new Error("An error occurred, please try again later.");
  }
};
