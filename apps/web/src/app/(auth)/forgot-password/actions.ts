"use server";

import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/server";

export const sendPasswordResetEmail = async (email: string) => {
  try {
    const res = await api.auth.forgotPassword({ email });
    return res;
  } catch (error) {
    if (error instanceof TRPCError) {
      return error.message;
    }
    return "An error occurred, please try again later.";
  }
};
