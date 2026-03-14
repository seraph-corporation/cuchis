import { NextRequest, NextResponse } from "next/server";
import { client } from "@/app/lib/sanity";

export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "Product IDs array is required" },
        { status: 400 }
      );
    }

    if (!client) {
      return NextResponse.json(
        { error: "Sanity client not configured" },
        { status: 500 }
      );
    }

    const products = await client.fetch(
      `*[_type == "product" && _id in $ids] {
        _id,
        title,
        slug,
        price,
        images,
        inStock
      }`,
      { ids: productIds }
    );

    // Convert to object keyed by _id
    const productsMap = products.reduce((acc: any, product: any) => {
      acc[product._id] = product;
      return acc;
    }, {});

    return NextResponse.json(productsMap);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
