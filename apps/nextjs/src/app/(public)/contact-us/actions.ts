"use server";

import { TRPCError } from "@trpc/server";

import type { ContactUs } from "@millennicare/validators";

import { api } from "~/trpc/server";

export const create = async (values: ContactUs) => {
  try {
    await api.contactUs.sendMessage(values);
  } catch (error) {
    if (error instanceof TRPCError) {
      return error.message;
    }
    return "An error occurred, please try again later.";
  }
};
