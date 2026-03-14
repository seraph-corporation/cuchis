import { client, productsQuery, productsByCategoryQuery, categoriesQuery } from "@/app/lib/sanity";
import ProductCard from "@/app/components/product/product-card";
import Link from "next/link";

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: { category?: string; featured?: string };
}

async function getProducts(categorySlug?: string, featured?: string) {
  try {
    if (!client) {
      console.warn("Sanity client not configured. Returning empty products.");
      return [];
    }
    if (categorySlug) {
      return await client.fetch(productsByCategoryQuery, { categorySlug });
    }
    if (featured === "true") {
      const allProducts = await client.fetch(productsQuery);
      return allProducts.filter((p: any) => p.featured);
    }
    return await client.fetch(productsQuery);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    if (!client) {
      console.warn("Sanity client not configured. Returning empty categories.");
      return [];
    }
    return await client.fetch(categoriesQuery);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function ProductsPage(props: { searchParams: Promise<ProductsPageProps["searchParams"]> }) {
  const searchParams = await props.searchParams;
  const products = await getProducts(searchParams.category, searchParams.featured);
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-800">
          {searchParams.featured === "true"
            ? "Featured Products"
            : searchParams.category
              ? `Products: ${searchParams.category}`
              : "All Products"}
        </h1>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${!searchParams.category && searchParams.featured !== "true"
                ? "bg-primary-600 text-white"
                : "bg-beige-100 text-primary-700 hover:bg-beige-200"
              }`}
          >
            All
          </Link>
          <Link
            href="/products?featured=true"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${searchParams.featured === "true"
                ? "bg-primary-600 text-white"
                : "bg-beige-100 text-primary-700 hover:bg-beige-200"
              }`}
          >
            Featured
          </Link>
          {categories.map((category: any) => (
            <Link
              key={category._id}
              href={`/products?category=${category.slug.current}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${searchParams.category === category.slug.current
                  ? "bg-primary-600 text-white"
                  : "bg-beige-100 text-primary-700 hover:bg-beige-200"
                }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-beige-300 bg-beige-50 p-12 text-center">
          <p className="text-primary-700">No products found.</p>
        </div>
      )}
    </div>
  );
}
