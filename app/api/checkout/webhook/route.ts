import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { db } from "@/app/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    try {
      const userId = session.metadata.userId;
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);
      const billingAddress = JSON.parse(session.metadata.billingAddress);

      // Get cart items
      const cart = await db.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }

      // Calculate totals (simplified - should fetch actual prices from Sanity)
      const subtotal = cart.items.reduce((sum, item) => {
        // In production, fetch actual product price from Sanity
        return sum + 10 * item.quantity; // Placeholder
      }, 0);

      const tax = subtotal * 0.1;
      const shipping = subtotal > 100 ? 0 : 10;
      const total = subtotal + tax + shipping;

      // Create order
      const order = await db.order.create({
        data: {
          userId,
          total,
          subtotal,
          tax,
          shipping,
          status: "processing",
          shippingAddress: JSON.stringify(shippingAddress),
          billingAddress: JSON.stringify(billingAddress),
          paymentIntentId: session.payment_intent,
          paymentStatus: "paid",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              title: `Product ${item.productId}`, // Should fetch from Sanity
              price: 10, // Should fetch from Sanity
              quantity: item.quantity,
              variant: item.variant,
            })),
          },
        },
      });

      // Clear cart
      await db.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    } catch (error) {
      console.error("Error processing order:", error);
      return NextResponse.json(
        { error: "Error processing order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
