export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  // Check if "user" field should be here or handled otherwise.
});

// ... GET function (unchanged usually) ...

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const { productId, rating, title, comment } = reviewSchema.parse(body);

    const userId = "guest_user_123";

    // Check if user already reviewed this product
    const existingReview = await db.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      // Update existing review
      const review = await db.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          title: title || null,
          comment: comment || null,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(review);
    } else {
      // Create new review
      const review = await db.review.create({
        data: {
          userId,
          productId,
          rating,
          title: title || null,
          comment: comment || null,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(review, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
