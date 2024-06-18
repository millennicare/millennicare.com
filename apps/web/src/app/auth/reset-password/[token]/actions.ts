"use server";

import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/server";

export const resetPassword = async (newPassword: string, token: string) => {
  try {
    await api.auth.resetPassword({ password: newPassword, token });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred, please try again later.");
  }
};
