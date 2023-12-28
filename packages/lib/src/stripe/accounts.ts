import { stripe } from ".";

/**
 * Accounts are created when a careseeker registers
 * @param email
 * @returns
 */
export const createAccount = async (email: string) => {
  return stripe.accounts.create({
    type: "express",
    email: email,
  });
};

export const getAccountById = async (stripe_id: string) => {
  return stripe.accounts.retrieve(stripe_id);
};

// @TODO: create update function when needed

export const deleteAccount = async (stripe_id: string) => {
  return stripe.accounts.del(stripe_id);
};

/**
 * Generates a Stripe account link URL so caregivers can accept payouts
 */
export const getAccountLink = async (stripe_id: string) => {
  return stripe.accountLinks.create({
    account: stripe_id,
    // @TODO: these need to change when sign up flow has been created
    refresh_url: "https://millennicare.com/sign-up/caregiver",
    return_url: "https://millennicare.com/sign-up/caregiver",
    type: "account_onboarding",
  });
};
