"use server";

import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

  const customer = await updateCustomer(customer_id, {
    email: values.email,
    name: `${values.firstName} ${values.lastName}`,
  });
  console.log(customer);

  const params = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: "stevenarce650@gmail.com",
  };
  const user = await clerkClient.users.updateUser(userId, params);
  console.log(user);

  await api.auth.update.mutate({ ...values });

  revalidatePath("dashboard/settings");
}
