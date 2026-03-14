"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/components/ui/button";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  variant?: string;
  product?: {
    _id: string;
    title: string;
    price: number;
    images?: any[];
  };
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Record<string, any>>({});

  useEffect(() => {
    if (session) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);

        // Fetch product details
        const productIds = data.items.map((item: CartItem) => item.productId);
        if (productIds.length > 0) {
          const productsResponse = await fetch("/api/cart/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productIds }),
          });
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            setProducts(productsData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (!session) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-800 mb-4">
            Please sign in to view your cart
          </h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p>Loading cart...</p>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-primary-700 mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = products[item.productId];
              if (!product) return null;

              const imageUrl = product.images?.[0]
                ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${product.images[0].asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png")}`
                : "/placeholder.jpg";

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 rounded-xl border border-beige-300 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-48 w-full sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg bg-beige-50 mx-auto sm:mx-0">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 96px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h3 className="font-bold text-primary-800 text-lg sm:text-base">
                      {product.title}
                    </h3>
                    <p className="text-primary-600 font-medium">${product.price.toFixed(2)}</p>
                    <div className="mt-4 sm:mt-2 flex items-center gap-4 sm:gap-2">
                      <div className="flex items-center border border-beige-300 rounded-lg overflow-hidden h-10 sm:h-8">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 sm:px-2 hover:bg-beige-50 transition-colors border-r border-beige-300"
                        >
                          -
                        </button>
                        <span className="px-4 sm:px-2 font-medium min-w-[2.5rem] sm:min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 sm:px-2 hover:bg-beige-50 transition-colors border-l border-beige-300"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-center sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-beige-100 sm:min-w-[100px]">
                    <p className="text-lg font-bold text-primary-800">
                      ${(product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-beige-300 bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-primary-800">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-beige-300 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout" className="mt-6 block">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
