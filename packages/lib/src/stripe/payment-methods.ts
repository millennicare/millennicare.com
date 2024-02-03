import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// eventually, these will accomodate other payment methods
export type CreatePaymentMethodInput = {
  type: "card";
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  billing_details: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
    name: string;
  };
  customer_id: string;
};

export const createPaymentMethod = async (values: CreatePaymentMethodInput) =>
  await stripe.paymentMethods.create({
    ...values,
  });

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
  card?: {
    exp_month: number;
    exp_year: number;
  };
};

export const updatePaymentMethod = async (values: UpdatePaymentMethodInput) =>
  await stripe.paymentMethods.update(values.payment_method_id, { ...values });

export type GetPaymentMethodbyCustomerIdInput = {
  customer_id: string;
  payment_method_id: string;
};

export const getPaymentMethodByCustomerId = async (
  values: GetPaymentMethodbyCustomerIdInput,
) =>
  await stripe.customers.retrievePaymentMethod(
    values.customer_id,
    values.payment_method_id,
  );

export type GetAllPaymentMethodsInput = {
  customer_id: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
};

export const getAllPaymentMethods = async (
  values: GetAllPaymentMethodsInput,
) => {
  const response = await stripe.customers.listPaymentMethods(
    values.customer_id,
  );

  return response.data.map((payment) => ({
    id: payment.id,
    brand: payment.card?.brand,
    last4: payment.card?.last4,
    exp_month: payment.card?.exp_month,
    exp_year: payment.card?.exp_year,
  }));
};

export const deletePaymentMethod = async (payment_method_id: string) =>
  await stripe.paymentMethods.detach(payment_method_id);
