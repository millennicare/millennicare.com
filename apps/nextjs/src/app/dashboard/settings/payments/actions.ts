"use server";

import type {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "@millennicare/lib";

import { api } from "~/trpc/server";

export type CreatePaymentInput = Omit<CreatePaymentMethodInput, "customer_id">;

export async function createPayment(values: CreatePaymentInput) {
  await api.careseeker.createPayment(values);
}

export async function updatePayment(values: UpdatePaymentMethodInput) {
  await api.careseeker.updatePayment(values);
}

export async function deletePayment(values: { payment_method_id: string }) {
  await api.careseeker.deletePaymentMethod(values);
}
