export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { client, searchProductsQuery } from "@/app/lib/sanity";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    if (!client) {
      return NextResponse.json(
        { error: "Sanity client not configured" },
        { status: 500 }
      );
    }

    const products = await client.fetch(searchProductsQuery, {
      searchTerm: `*${query}*`,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
