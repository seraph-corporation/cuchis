import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user || (session.user as any).role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const orders = await db.order.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const stats = {
      totalOrders: await db.order.count(),
      totalRevenue: (
        await db.order.aggregate({
          _sum: { total: true },
        })
      )._sum.total || 0,
      pendingOrders: await db.order.count({
        where: { status: "pending" },
      }),
    };

    return NextResponse.json({ orders, stats });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user || (session.user as any).role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
