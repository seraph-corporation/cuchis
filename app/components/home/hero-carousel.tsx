"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/app/lib/sanity";

interface Product {
    _id: string;
    title: string;
    price: number;
    slug: { current: string };
    images: any[];
    _type: string;
}

interface HeroCarouselProps {
    products: Product[];
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!products || products.length === 0) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % products.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [products]);

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full aspect-[4/5] sm:aspect-square max-w-md mx-auto rounded-2xl overflow-hidden glass-effect shadow-2xl animate-fade-in-up delay-300 group">
            {products.map((product, index) => {
                const isActive = index === activeIndex;
                const imageUrl = product.images?.[0] ? (urlFor(product.images[0]) as any).url() : "/placeholder.jpg";

                // Map _type to a nice label and icon
                let categoryLabel = product._type;
                let icon = "✨";
                if (product._type === "dresses") { categoryLabel = "Dress"; icon = "👗"; }
                if (product._type === "bags") { categoryLabel = "Bag"; icon = "👜"; }
                if (product._type === "jewelry") { categoryLabel = "Jewelry"; icon = "💎"; }

                return (
                    <div
                        key={product._id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <Link href={`/products/${product.slug?.current || ""}`}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 400px"
                                    priority={index === 0}
                                />

                                {/* Gradient Overlay for Text Readability */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

                                {/* Product Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-left transform transition-transform duration-500">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium mb-3 border border-white/30">
                                        <span>{icon}</span> {categoryLabel}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 line-clamp-1 drop-shadow-md">
                                        {product.title}
                                    </h3>
                                    <p className="text-white/90 font-medium drop-shadow-sm">
                                        ${product.price?.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
