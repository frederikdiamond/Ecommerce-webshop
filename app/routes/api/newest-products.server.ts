import { desc } from "drizzle-orm";
import { json } from "@remix-run/node";
import { db } from "~/db/index.server";
import { products } from "~/db/schema.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  try {
    const newestProducts = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        specifications: products.specifications,
        price: products.price,
        images: products.images,
        createdAt: products.createdAt,
      })
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    // Remove after testing
    console.log("Raw newest products:", newestProducts);

    if (!newestProducts || newestProducts.length === 0) {
      return json({ newestProducts: [] });
    }

    return json({
      newestProducts: newestProducts.map((product) => ({
        ...product,
        id: product.id.toString(),
        specifications: product.specifications || [],
        price: product.price / 100,
        images: product.images || null,
        createdAt: product.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return json({ error: "Failed to fetch newest products" }, { status: 500 });
  }
}
