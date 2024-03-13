"use server";

import type { UpdateUser } from "@millennicare/validators";
import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

export async function updateCareseeker(values: UpdateUser) {
  try {
    console.log(values);
    // await api.auth.update(values);
    revalidatePath("/dashboard/settings");
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong, please try again later.");
  }
}
