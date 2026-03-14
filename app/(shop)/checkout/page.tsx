"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Button from "@/app/components/ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress,
          billingAddress,
        }),
      });

      const { sessionId } = await response.json();

      if (sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p>Please sign in to checkout</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-primary-800 mb-4">
            Shipping Address
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={shippingAddress.name}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, name: e.target.value })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Street Address"
              required
              value={shippingAddress.street}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  street: e.target.value,
                })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="City"
              required
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="State"
              required
              value={shippingAddress.state}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  state: e.target.value,
                })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              required
              value={shippingAddress.zip}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, zip: e.target.value })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Country"
              required
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary-800 mb-4">
            Billing Address
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={billingAddress.name}
              onChange={(e) =>
                setBillingAddress({ ...billingAddress, name: e.target.value })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Street Address"
              required
              value={billingAddress.street}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  street: e.target.value,
                })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="City"
              required
              value={billingAddress.city}
              onChange={(e) =>
                setBillingAddress({ ...billingAddress, city: e.target.value })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="State"
              required
              value={billingAddress.state}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  state: e.target.value,
                })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              required
              value={billingAddress.zip}
              onChange={(e) =>
                setBillingAddress({ ...billingAddress, zip: e.target.value })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Country"
              required
              value={billingAddress.country}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  country: e.target.value,
                })
              }
              className="rounded-md border border-beige-300 px-3 py-2"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Processing..." : "Proceed to Payment"}
        </Button>
      </form>
    </div>
  );
}
