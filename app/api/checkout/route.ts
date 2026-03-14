import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { shippingAddress, billingAddress } = await request.json();

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: "Shipping and billing addresses are required" },
        { status: 400 }
      );
    }

    // const userId = (session.user as any).id;
    const userId = "guest_user_123";

    // Get cart
    const cart = await db.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Fetch product details from Sanity to get current prices
    // For now, we'll use a simplified approach
    // In production, you'd want to fetch all products at once
    const lineItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      // In a real app, you'd fetch the product from Sanity here
      // For now, we'll create a placeholder
      // You should fetch the actual product price from Sanity
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Product ${item.productId}`,
          },
          unit_amount: 1000, // Placeholder - should be actual price * 100
        },
        quantity: item.quantity,
      });
      subtotal += 1000 * item.quantity; // Placeholder calculation
    }

    const tax = subtotal * 0.1;
    const shipping = subtotal > 10000 ? 0 : 1000; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cart`,
      metadata: {
        userId,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
