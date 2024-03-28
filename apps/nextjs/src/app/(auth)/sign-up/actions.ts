"use server";

import { revalidatePath } from "next/cache";
import { getAddressSuggestions } from "@millennicare/lib";
import { TRPCError } from "@trpc/server";

import type { AdditionalInfo } from "./careseeker/slices/additional-info-slice";
import type { Address } from "./careseeker/slices/address-slice";
import type { Children } from "./careseeker/slices/children-slice";
import type { Email } from "./careseeker/slices/email-slice";
import type { Password } from "./careseeker/slices/password-slice";
import { createSession } from "~/app/lib/auth";
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

type CareseekerRegister = AdditionalInfo &
  Address &
  Children &
  Email &
  Password;

export const careseekerRegister = async (values: CareseekerRegister) => {
  try {
    const response = await api.auth.careseekerRegister(values);
    await createSession(response.id, values.email);

    revalidatePath("/sign-up/careseeker");
  } catch (error) {
    console.error(error);
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred, please try again later.");
  }
};
