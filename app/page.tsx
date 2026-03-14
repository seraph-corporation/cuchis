import { client, featuredProductsQuery, productsByCategoryQuery } from "./lib/sanity";
import HeroCarousel from "./components/home/hero-carousel";
import ProductCard from "./components/product/product-card";
import Link from "next/link";

export const revalidate = 60; // Revalidate every 60 seconds


async function getFeaturedProducts() {
  try {
    if (!client) {
      console.warn("Sanity client not configured. Returning empty products.");
      return [];
    }
    const products = await client.fetch(featuredProductsQuery);
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

async function getCategoryProducts(categorySlug: string, limit = 3) {
  try {
    if (!client) return [];
    const products = await client.fetch(productsByCategoryQuery, { categorySlug });
    if (!products || products.length === 0) return [];

    // Shuffle and pick up to 'limit' products
    return products
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  } catch (error) {
    console.error(`Error fetching products for ${categorySlug}:`, error);
    return [];
  }
}

export default async function Home() {
  // Fetch featured products
  const featuredProductsPromise = getFeaturedProducts();
  const dressPromise = getCategoryProducts("dresses", 3);
  const bagPromise = getCategoryProducts("bags", 3);
  const jewelryPromise = getCategoryProducts("jewelry", 3);

  const [featuredProducts, dresses, bags, jewelry] = await Promise.all([
    featuredProductsPromise,
    dressPromise,
    bagPromise,
    jewelryPromise
  ]);

  // Combine, filter out nulls and shuffle all carousel items
  const carouselProducts = [...dresses, ...bags, ...jewelry]
    .filter(Boolean)
    .sort(() => Math.random() - 0.5);

  return (
    <div className="w-full">
      {/* Animated Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-beige-100 via-tan-100 to-primary-50 py-24 sm:py-32 animate-gradient-slow lg:min-h-[600px] flex items-center justify-center">
        {/* Floating background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-tan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-beige-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in-up">
              <h1 className="text-5xl font-extrabold text-primary-900 sm:text-7xl tracking-tight mb-6 drop-shadow-sm">
                Welcome to <span className="block text-primary-900 mt-2">Cuchi's Boutique</span>
              </h1>
              <p className="mt-4 text-xl sm:text-2xl text-primary-800/80 max-w-2xl mx-auto lg:mx-0 font-medium delay-100 animate-fade-in-up">
                Discover our curated collection of quality products, designed to elevate your everyday style.
              </p>
              <div className="mt-10 delay-200 animate-fade-in-up">
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-full bg-white border-2 border-primary-900 px-8 py-4 text-lg font-semibold text-primary-900 shadow-lg hover:bg-primary-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Shop the Collection
                </Link>
              </div>
            </div>

            {/* Carousel injected here */}
            {carouselProducts.length > 0 && (
              <div className="w-full max-w-md mx-auto lg:max-w-none">
                <HeroCarousel products={carouselProducts} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrolling Marquee */}
      <div className="w-full bg-primary-900 border-y py-3 overflow-hidden flex border-primary-800">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center text-beige-100 text-sm sm:text-base font-medium tracking-widest uppercase">
              <span className="mx-8">✨ Latest Trends</span>
              <span className="mx-8">•</span>
              <span className="mx-8">Free Shipping Over $100</span>
              <span className="mx-8">•</span>
              <span className="mx-8">💎 Premium Quality</span>
              <span className="mx-8">•</span>
              <span className="mx-8">New Arrivals Weekly</span>
              <span className="mx-8">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-primary-800">
                  Featured Products
                </h2>
                <p className="mt-2 text-primary-700">
                  Handpicked favorites from our collection
                </p>
              </div>
              <Link
                href="/products?featured=true"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.slice(0, 8).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
