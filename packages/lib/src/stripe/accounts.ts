import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createAccount = async (email: string) => {
  const account = await stripe.accounts.create({
    type: "express",
    email,
  });

  return account;
};

export const getAccountById = async (accountId: string) => {
  const account = await stripe.accounts.retrieve(accountId);

  return account;
};

export const deleteAccount = async (accountId: string) => {
  return stripe.accounts.del(accountId);
};

export const getAccountLink = async (accountId: string) => {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: "https://millennicare.com/sign-up/caregiver",
    return_url: "https://millennicare.com/sign-up/caregiver",
    type: "account_onboarding",
  });

  return accountLink;
};
