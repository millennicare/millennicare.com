import { stripe } from ".";

// customers are careseeker objects
export const createCustomer = async (
  firstName: string,
  lastName: string,
  email: string,
) => {
  const customer = await stripe.customers.create({
    name: `${firstName} ${lastName}`,
    email: email,
  });

  return customer;
};

export type UpdateCustomerInput = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
};
// update customer
export const updateCustomer = async (
  customer_id: string,
  input: UpdateCustomerInput,
) => {
  const values = {
    email: input.email,
    name: `${input.firstName} ${input.lastName}`,
  };

  const customer = await stripe.customers.update(customer_id, values);
  return customer;
};

// get customer
export const getCustomer = async (customerId: string) => {
  const customer = await stripe.customers.retrieve(customerId);
  return customer;
};

// delete customer
export const deleteCustomer = async (customerId: string) => {
  const response = await stripe.customers.del(customerId);
  return response;
};
