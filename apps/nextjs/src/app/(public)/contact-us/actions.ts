"use server";

import type { ContactUs } from "@millennicare/validators";
import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/server";

export const create = async (values: Omit<ContactUs, "id">) => {
  try {
    await api.contactUs.sendMessage(values);
  } catch (error) {
    if (error instanceof TRPCError) {
      return error.message;
    }
    return "An error occurred, please try again later.";
  }
};
