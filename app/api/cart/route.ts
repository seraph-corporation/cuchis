export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = "guest_user_123"; // Logic for guest user

    const cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: cart.items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await db.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: "Item ID and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id: itemId } });
    } else {
      await db.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
