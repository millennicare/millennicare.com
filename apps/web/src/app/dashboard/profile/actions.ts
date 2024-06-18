"use server";

import type { z } from "zod";
import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";

import { insertChildSchema } from "@millennicare/db/schema";

import { api } from "~/trpc/server";

const schema = insertChildSchema.partial().required({ id: true });

export async function editChild(values: z.infer<typeof schema>) {
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
