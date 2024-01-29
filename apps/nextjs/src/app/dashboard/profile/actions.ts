"use server";

import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

import { api } from "~/trpc/server";

export async function editChild(values: {
  childId: string;
  name: string;
  age: number;
}) {
  try {
    await api.children.update(values);
    revalidatePath("/dashboard/profile");
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong, please try again later.");
  }
}

export async function addChild(input: { name: string; age: number }) {
  try {
    await api.children.create({
      name: input.name,
      age: input.age,
    });
    revalidatePath("dashboard/profile");
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong, please try again later.");
  }
}

export async function deleteChild(childId: string) {
  try {
    await api.children.delete({
      childId,
    });
    revalidatePath("dashboard/profile");
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong, please try again later.");
  }
}
