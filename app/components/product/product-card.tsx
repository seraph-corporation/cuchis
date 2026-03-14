import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/app/lib/sanity";

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    images?: any[];
    inStock?: boolean;
    featured?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(400).height(400).url()
    : "/placeholder.jpg";

  return (
    <Link href={`/products/${product.slug.current}`} className="block">
      <div className="group cursor-pointer overflow-hidden rounded-xl border border-beige-300 bg-white transition-all duration-300 hover:shadow-xl active:scale-[0.98]">
        <div className="relative aspect-square w-full overflow-hidden bg-beige-50">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.featured && (
            <div className="absolute top-3 right-3 rounded-full bg-primary-600/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Featured
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col items-center text-center">
          <h3 className="text-sm font-semibold text-primary-800 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[2.5rem] flex items-center">
            {product.title}
          </h3>
          <p className="mt-1 text-base font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </p>
          {!product.inStock && (
            <p className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-red-500 bg-red-50 px-2 py-0.5 rounded">
              Out of Stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
