import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCustomer = async (values: {
  name: string;
  email: string;
}) => {
  const customer = await stripe.customers.create({
    name: values.name,
    email: values.email,
  });

  return customer;
};

export interface UpdateCustomerInput {
  customerId: string;
  email?: string;
  name?: string;
}
export const updateCustomer = async (values: UpdateCustomerInput) => {
  const customer = await stripe.customers.update(values.customerId, {
    ...values,
  });

  return customer;
};

export const getCustomer = async (customerId: string) => {
  const customer = await stripe.customers.retrieve(customerId);

  return customer;
};

export const deleteCustomer = async (customerId: string) => {
  const response = await stripe.customers.del(customerId);
  return response;
};
