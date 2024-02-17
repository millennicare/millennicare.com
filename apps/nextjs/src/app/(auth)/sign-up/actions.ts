"use server";

import { TRPCError } from "@trpc/server";

import { getAddressSuggestions } from "@millennicare/lib";

import { api } from "~/trpc/server";

export const checkDuplicateEmail = async (email: string) => {
  try {
    await api.auth.checkDuplicateEmail({ email });
  } catch (error) {
    if (error instanceof TRPCError) {
      return error.message;
    }
    return "An error occurred, please try again later.";
  }
};

export const getSuggestion = async (address: string) => {
  if (address.length < 1) {
    return [];
  }
  const response = await getAddressSuggestions(address);
  console.log(response);
  return response;
};
