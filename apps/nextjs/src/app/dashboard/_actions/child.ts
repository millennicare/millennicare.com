"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

export async function editChild(values: {
  childId: string;
  name: string;
  age: number;
}) {
  await api.children.update.mutate(values);
  revalidatePath("/dashboard/profile");
}

export async function getChildren() {
  const response = await api.children.getByCareseekerId.query();
  return response;
}

export async function addChild(input: { name: string; age: number }) {
  await api.children.create.mutate({
    name: input.name,
    age: input.age,
  });
  revalidatePath("dashboard/profile");
}

export async function deleteChild(childId: string) {
  await api.children.delete.mutate({ childId });
  revalidatePath("dashboard/profile");
}
