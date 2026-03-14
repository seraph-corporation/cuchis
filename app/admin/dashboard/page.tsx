"use client";

import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    email: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p>Loading...</p>
      </div>
    );
  }

  // Auth check removed

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-beige-300 bg-white p-6">
          <h3 className="text-sm font-medium text-primary-600">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-primary-800">
            {stats.totalOrders}
          </p>
        </div>
        <div className="rounded-lg border border-beige-300 bg-white p-6">
          <h3 className="text-sm font-medium text-primary-600">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-primary-800">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-beige-300 bg-white p-6">
          <h3 className="text-sm font-medium text-primary-600">Pending Orders</h3>
          <p className="mt-2 text-3xl font-bold text-primary-800">
            {stats.pendingOrders}
          </p>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-2xl font-semibold text-primary-800 mb-4">Recent Orders</h2>
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
                    <p className="text-sm text-primary-600">{order.user.email}</p>
                    <p className="text-sm text-primary-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-800">
                      ${order.total.toFixed(2)}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="mt-2 rounded border border-beige-300 px-3 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
          </div>
        )}
      </div>
    </div>
  );
}
