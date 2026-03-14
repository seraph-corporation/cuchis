"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">My Account</h1>

      <div className="mb-8 rounded-lg border border-beige-300 bg-white p-6">
        <h2 className="text-2xl font-semibold text-primary-800 mb-4">
          Account Information
        </h2>
        <p className="text-primary-700">
          <strong>User:</strong> Guest User
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-primary-800 mb-4">
          Order History
        </h2>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-beige-300 bg-white p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-primary-800">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-primary-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-800">
                      ${order.total.toFixed(2)}
                    </p>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="border-t border-beige-200 pt-4">
                  <p className="text-sm text-primary-600">
                    {order.items.length} item(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-beige-300 bg-beige-50 p-12 text-center">
            <p className="text-primary-700">No orders yet.</p>
            <Link href="/shop" className="mt-4 inline-block">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Start Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
