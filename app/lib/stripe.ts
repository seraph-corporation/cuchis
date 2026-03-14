import Stripe from "stripe";

// Provide a dummy key if the actual one is missing to prevent build-time crashes
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_building_placeholder";

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});
