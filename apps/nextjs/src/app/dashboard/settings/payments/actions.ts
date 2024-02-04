"use server";

import { z } from "zod";

import type { UpdatePaymentMethodInput } from "@millennicare/lib";
import { paymentMethodInput } from "@millennicare/validators";

import { api } from "~/trpc/server";

export async function createPayment(
  values: z.infer<typeof paymentMethodInput>,
) {
  console.log("in createPayment values", JSON.stringify(values, null, 2));
  await api.careseeker.createPayment(values);
}

export async function updatePayment(values: UpdatePaymentMethodInput) {
  await api.careseeker.updatePayment(values);
}

export async function deletePayment(values: { payment_method_id: string }) {
  await api.careseeker.deletePaymentMethod(values);
}
