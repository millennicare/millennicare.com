"use server";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { api } from "~/trpc/server";

const schema = z.object({
  email: z.string().email(),
});

export async function submitWaitlist(
  prevState: unknown,
  data: FormData,
): Promise<{ message?: string; status: "success" | "warn" | "error" }> {
  console.log(prevState);
  const email = data.get("email");
  const parsed = schema.safeParse({ email });
  if (!parsed.success) {
    return { message: "Invalid email address.", status: "warn" };
  }

  try {
    await api.waitlist.create({ email: parsed.data.email });
    return { message: "Joined waitlist! 🎉", status: "success" };
  } catch (error) {
    if (error instanceof TRPCError) {
      return { message: error.message, status: "error" };
    }
    return {
      message: "An error occurred, please try again later.",
      status: "error",
    };
  }
}
