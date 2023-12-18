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

// update customer
export const updateCustomer = async (customer_id: string) => {
  const customer = await stripe.customers.update(customer_id, {});
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
