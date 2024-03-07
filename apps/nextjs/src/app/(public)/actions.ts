"use server";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { api } from "~/trpc/server";

const schema = z.object({
  email: z.string().email(),
});

export async function submitWaitlist(prevState: unknown, data: FormData) {
  console.log(prevState);
  const email = data.get("email");
  const parsed = schema.safeParse({ email });
  if (!parsed.success) {
    return "Invalid email address.";
  }

  try {
    await api.waitlist.create({ email: parsed.data.email });
    return "Joined waitlist! 🎉";
  } catch (error) {
    if (error instanceof TRPCError) {
      return error.message;
    }
    return "Something went wrong, please try again later.";
  }
}
