export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = "guest_user_123";

    const wishlist = await db.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const userId = "guest_user_123";

    // Check if already in wishlist
    const existing = await db.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already in wishlist" });
    }

    const wishlistItem = await db.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const userId = "guest_user_123";

    const item = await db.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (item) {
      await db.wishlist.delete({
        where: { id: item.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
