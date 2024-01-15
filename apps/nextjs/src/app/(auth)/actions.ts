"use server";

import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createCareseekerSchema } from "@millennicare/validators";

import { api } from "~/trpc/server";
import { getSession } from "../actions";

export const login = async (values: { email: string; password: string }) => {
  try {
    const session = await getSession();
    const response = await api.auth.login(values);

    session.sessionToken = response.sessionToken;
    session.isLoggedIn = true;
    await session.save();
    revalidatePath("/sign-in");
  } catch (error) {
    console.log(error);
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong, please try again later.");
  }
};

export const careseekerRegister = async (
  values: z.infer<typeof createCareseekerSchema>,
) => {
  try {
    revalidatePath("/sign-up/careseeker");
  } catch (error) {}
};

export const caregiverRegister = async (formData: FormData) => {};

export const checkDuplicateEmail = async (email: string) => {
  try {
    await api.auth.checkDuplicateEmail(email);
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong, please try again later.");
  }
};
