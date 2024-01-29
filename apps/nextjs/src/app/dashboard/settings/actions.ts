"use server";

import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

import type { UpdateUserType } from "@millennicare/validators";

import { api } from "~/trpc/server";

export async function updateCareseeker(values: UpdateUserType) {
  try {
    await api.auth.update(values);
    revalidatePath("/dashboard/settings");
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong, please try again later.");
  }
}
