"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { updateCustomer } from "@millennicare/lib";

import { api } from "~/trpc/server";
import type { UpdateProfileInput } from "../_types";

export async function getUserData() {
  const user = await api.auth.getMe.query();
  return user;
}

export async function getCareseekerData() {
  const careseeker = await api.careseeker.getCareseeker.query();
  return careseeker;
}

export async function updateProfile(
  customer_id: string,
  values: UpdateProfileInput,
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to update your profile.");
  }

  const data = {
    email: values.email,
    firstName: values.firstName,
    lastName: values.lastName,
  };
  await updateCustomer(customer_id, data);

  const user = await clerkClient.users.updateUser(userId, {
    firstName: values.firstName,
    lastName: values.lastName,
    primaryEmailAddressID: values.email,
  });
  console.log(user);

  await api.auth.update.mutate({ ...data });

  revalidatePath("dashboard/settings");
}
