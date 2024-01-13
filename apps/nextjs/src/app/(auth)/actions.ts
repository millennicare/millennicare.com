"use server";

import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/server";
import { getSession } from "../actions";

export const login = async (values: { email: string; password: string }) => {
  const session = await getSession();
  const response = await api.auth.login(values);

  session.sessionToken = response.sessionToken;
  session.isLoggedIn = true;
  await session.save();
  revalidatePath("/sign-in");
};

export const register = async (formData: FormData) => {};
