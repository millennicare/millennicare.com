"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { lucia } from "@millennicare/auth";

import { validateRequest } from "../lib/auth";

export async function signOut() {
  // eslint-ignore-next-line
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  // eslint-ignore-next-line
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  revalidatePath("/dashboard");
}
