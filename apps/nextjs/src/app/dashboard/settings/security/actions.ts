"use server";

import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/server";

// update user password
export async function updatePassword(values: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string; success: boolean }> {
  try {
    await api.auth.resetPassword(values);
    return { message: "Password updated successfully.", success: true };
  } catch (error) {
    if (error instanceof TRPCError) {
      return { message: error.message, success: false };
    }
    return {
      message: "Something went wrong, please try again later.",
      success: false,
    };
  }
}
