"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs";

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
  user_id: string,
  customer_id: string,
  values: UpdateProfileInput,
) {
  console.log(values);
  const data = {
    email: values.email,
    firstName: values.firstName,
    lastName: values.lastName,
  };
  const customer = await updateCustomer(customer_id, data);
  console.log(customer);

  const user = await clerkClient.users.updateUser(user_id, {
    firstName: values.firstName,
    lastName: values.lastName,
    primaryEmailAddressID: values.email,
  });
  console.log(user);

  revalidatePath("dashboard/settings");
}
