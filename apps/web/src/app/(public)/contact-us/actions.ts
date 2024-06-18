"use server";

import type { z } from "zod";
import { TRPCError } from "@trpc/server";

import type { insertContactSchema } from "@millennicare/db/schema";

import { api } from "~/trpc/server";

export const create = async (values: z.infer<typeof insertContactSchema>) => {
  try {
    await api.contactUs.sendMessage(values);
  } catch (error) {
    if (error instanceof TRPCError) {
      return error.message;
    }
    return "An error occurred, please try again later.";
  }
};
