import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// eventually, these will accomodate other payment methods
export type CreatePaymentMethodInput = {
  type: "card";
  card: { number: string; exp_month: number; exp_year: number; cvc: string };
  customer_id: string;
};

export const createPaymentMethod = async (values: CreatePaymentMethodInput) => {
  const paymentMethod = await stripe.paymentMethods.create({
    ...values,
  });

  return paymentMethod.id;
};

export type UpdatePaymentMethodInput = {
  payment_method_id: string;
  billing_details?: {
    address: {
      city: string;
      country: string; // 2 letter country code
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
  };
};

export const updatePaymentMethod = async (values: UpdatePaymentMethodInput) => {
  const paymentMethod = await stripe.paymentMethods.update(
    values.payment_method_id,
    { ...values },
  );

  return paymentMethod;
};

export type GetPaymentMethodbyCustomerIdInput = {
  customer_id: string;
  payment_method_id: string;
};

export const getPaymentMethodByCustomerId = async (
  values: GetPaymentMethodbyCustomerIdInput,
) => {
  const paymentMethod = await stripe.customers.retrievePaymentMethod(
    values.customer_id,
    values.payment_method_id,
  );

  return paymentMethod;
};

export type GetAllPaymentMethodsInput = {
  customer_id: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
};

export const getAllPaymentMethods = async (
  values: GetAllPaymentMethodsInput,
) => {
  const paymentMethods = await stripe.customers.listPaymentMethods(
    values.customer_id,
    {
      ...values,
    },
  );

  return paymentMethods;
};

export const deletePaymentMethod = async (payment_method_id: string) => {
  await stripe.paymentMethods.detach(payment_method_id);
};
