import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";

const projectId = "p8o637q1";
const dataset = "production";
const apiVersion = "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = client ? createImageUrlBuilder(client) : null;

export function urlFor(source: any) {
  if (!builder || !source) return { src: "", width: 0, height: 0 };
  return builder.image(source);
}

// GROQ Queries
export const productsQuery = `*[_type in ["dresses", "bags", "jewelry", "other"]] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  price,
  description,
  images,
  inStock,
  featured,
  tags
}`;

export const featuredProductsQuery = `*[_type in ["dresses", "bags", "jewelry", "other"] && featured == true] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  price,
  description,
  images,
  inStock,
  featured,
  tags
}`;

export const productBySlugQuery = `*[_type in ["dresses", "bags", "jewelry", "other"] && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  price,
  description,
  images,
  inStock,
  featured,
  tags,
  variants,
  sizes,
  colors,
  material,
  dimensions,
  metalType,
  gemstone,
  type
}`;

export const productsByCategoryQuery = `*[_type == $categorySlug] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  price,
  description,
  images,
  inStock,
  featured,
  tags
}`;

export const searchProductsQuery = `*[_type in ["dresses", "bags", "jewelry", "other"] && title match $searchTerm] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  price,
  description,
  images,
  inStock,
  featured,
  tags
}`;

// Categories are now Types, so we construct a virtual list or fetch metadata if we had a separate category config. 
// For now, since categories are hard-coded types, we can return a static list or fetch from a 'siteSettings' if it existed.
// But the ShopPage expects to fetch something. 
// Let's create a query that "fakes" categories by returning the types we know exist, 
// OR we rely on the client knowing the types. 
// The most robust way without a specific "category" document is to just return static data or aggregate.
// However, the user liked the "icon" and "gradient" fields. 
// Since we deleted "category" schema, we lost where to store "icon" and "gradient".
// We should probably have a "collection" schema that stores metadata for these types, OR distinct schemas for them.
// Given the user constraint, I will hardcode the category definitions back in the frontend 
// OR, more cleverly, I can't query "categories" anymore because I deleted the table.
// I will return an empty array for categoriesQuery for now, and handle it in the frontend.
export const categoriesQuery = `*[_type == "category"]`; // This will now return nothing.
