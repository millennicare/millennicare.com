"use server";

import { TRPCError } from "@trpc/server";

import { getAddressSuggestions } from "@millennicare/lib";

import { api } from "~/trpc/server";

export const checkDuplicateEmail = async (email: string) => {
  try {
    await api.auth.checkDuplicateEmail({ email });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred, please try again later.");
  }
};

export const getSuggestion = async (address: string) => {
  if (address.length < 1) {
    return [];
  }
  const response = await getAddressSuggestions(address);
  return response;
};
