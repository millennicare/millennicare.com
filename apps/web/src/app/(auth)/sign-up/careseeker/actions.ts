"use server";

import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

import type { AdditionalInfo } from "./slices/additional-info-slice";
import type { Address } from "./slices/address-slice";
import type { Children } from "./slices/children-slice";
import type { Email } from "./slices/email-slice";
import type { Password } from "./slices/password-slice";
import { createSession } from "~/app/lib/auth";
import { api } from "~/trpc/server";

type CareseekerRegister = AdditionalInfo &
  Address &
  Children &
  Email &
  Password;

export const careseekerRegister = async (values: CareseekerRegister) => {
  try {
    const { session } = await api.auth.careseekerRegister({
      ...values,
    });
    await createSession(session);

    revalidatePath("/sign-up/careseeker");
  } catch (error) {
    console.error(error);
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred, please try again later.");
  }
};
