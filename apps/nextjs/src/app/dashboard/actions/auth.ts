"use server";

import { api } from "~/trpc/server";

export async function getUserData() {
  const user = await api.auth.getMe.query();
  return user;
}
