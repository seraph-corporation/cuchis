import { client, productsQuery } from "@/app/lib/sanity";
import ProductCard from "@/app/components/product/product-card";
import Link from "next/link";

export const revalidate = 60;

// Since we deleted the category schema, we define the display metadata here
// The slug corresponds to the _type in Sanity
const categoryMetadata = [
  {
    title: "Dresses",
    slug: "dresses",
    description: "Elegant and stylish dresses for every occasion",
    icon: "👗",
    gradient: "from-tan-400 to-tan-600",
  },
  {
    title: "Bags",
    slug: "bags",
    description: "Handbags, totes, and accessories",
    icon: "👜",
    gradient: "from-beige-400 to-beige-600",
  },
  {
    title: "Jewelry",
    slug: "jewelry",
    description: "Beautiful jewelry pieces to complete your look",
    icon: "💎",
    gradient: "from-primary-400 to-primary-600",
  },
  {
    title: "Other",
    slug: "other",
    description: "Discover more unique pieces",
    icon: "✨",
    gradient: "from-tan-300 to-beige-500",
  },
];

async function getAllProducts() {
  try {
    if (!client) {
      return [];
    }
    return await client.fetch(productsQuery);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export default async function ShopPage() {
  const allProducts = await getAllProducts();

  // Create a map of type -> products
  const productsByType: Record<string, any[]> = {};

  // Initialize with empty arrays for all types
  categoryMetadata.forEach(cat => {
    productsByType[cat.slug] = [];
  });

  // Distribute products to their types
  allProducts.forEach((product: any) => {
    if (product._type && productsByType[product._type]) {
      productsByType[product._type].push(product);
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold text-primary-800 mb-4">
          Welcome to Our Shop
        </h1>
        <p className="text-xl text-primary-700 max-w-2xl mx-auto">
          Discover our curated collection of quality products, handpicked just for you
        </p>
      </div>

      {/* Category Cards */}
      <div className="mb-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {categoryMetadata.map((category) => {
          // Default gradient if none provided
          const gradient = category.gradient || "from-primary-400 to-primary-600";

          // Parse gradient safely
          let fromColor = "var(--color-primary-400)";
          let toColor = "var(--color-primary-600)";

          try {
            const parts = gradient.split(' ');
            if (parts.length >= 2) {
              const fromPart = parts[0].replace('from-', '');
              const toPart = parts[1].replace('to-', '');
              fromColor = `var(--color-${fromPart})`;
              toColor = `var(--color-${toPart})`;
            }
          } catch (e) {
            console.error("Error parsing gradient:", e);
          }

          const productCount = productsByType[category.slug]?.length || 0;

          return (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-4 sm:p-8 text-white transition-all duration-300 hover:scale-105 active:scale-[0.98] shadow-md hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
              }}
            >
              <div className="text-3xl sm:text-5xl mb-2 sm:mb-4">{category.icon}</div>
              <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">{category.title}</h3>
              <p className="text-[10px] sm:text-sm opacity-90 mb-3 sm:mb-4 line-clamp-2 md:line-clamp-none">
                {category.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] sm:text-sm font-medium">
                  {productCount} {productCount === 1 ? "item" : "items"}
                </span>
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Product Sections */}
      <div className="space-y-16">
        {categoryMetadata.map((category) => {
          const products = productsByType[category.slug] || [];

          return (
            <section key={category.slug}>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-primary-800">
                    {category.title}
                  </h2>
                  <p className="mt-2 text-primary-700">{category.description}</p>
                </div>
                {products.length > 4 && (
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All ({products.length}) →
                  </Link>
                )}
              </div>

              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.slice(0, 4).map((product: any) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                  {products.length > 4 && (
                    <div className="mt-8 text-center">
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="inline-flex items-center rounded-md bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 transition-colors"
                      >
                        View All {category.title}
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-beige-300 bg-beige-50 p-12 text-center">
                  <p className="text-primary-700">
                    No products available in this collection yet.
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
