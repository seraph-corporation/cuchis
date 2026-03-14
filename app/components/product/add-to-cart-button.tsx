"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";

interface AddToCartButtonProps {
  productId: string;
  variant?: string;
}

export default function AddToCartButton({
  productId,
  variant,
}: AddToCartButtonProps) {
  // const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    // if (!session) {
    //   router.push("/login");
    //   return;
    // }

    setLoading(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          variant: variant || null,
        }),
      });

      if (response.ok) {
        // Optionally show a success message or update cart count
        router.refresh();
      } else {
        console.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
