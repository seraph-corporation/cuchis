import { client, productBySlugQuery } from "@/app/lib/sanity";
import { urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/app/components/product/add-to-cart-button";
import ProductReviews from "@/app/components/product/product-reviews";

export const revalidate = 60;

interface ProductPageProps {
  params: { id: string };
}

async function getProduct(slug: string) {
  try {
    if (!client) {
      console.warn("Sanity client not configured. Returning null.");
      return null;
    }
    const product = await client.fetch(productBySlugQuery, { slug });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const mainImage = product.images?.[0]
    ? urlFor(product.images[0]).width(800).height(800).url()
    : "/placeholder.jpg";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center text-primary-600 hover:text-primary-700"
      >
        ← Back to Products
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-beige-50">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image: any, index: number) => {
                const imageUrl = urlFor(image).width(200).height(200).url();
                return (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg bg-beige-50"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.title} ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold text-primary-800">{product.title}</h1>
          <p className="mt-4 text-3xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </p>

          {product.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-primary-800">Description</h2>
              <p className="mt-2 text-primary-700">{product.description}</p>
            </div>
          )}

          {product.category && (
            <div className="mt-4">
              <span className="text-sm text-primary-600">
                Category: {product.category.name}
              </span>
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton productId={product._id} />
          </div>

          {!product.inStock && (
            <p className="mt-4 text-red-600">This product is currently out of stock.</p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <ProductReviews productId={product._id} />
      </div>
    </div>
  );
}
