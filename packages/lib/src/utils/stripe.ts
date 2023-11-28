import * as dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({
  path: "../../.env",
});

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
