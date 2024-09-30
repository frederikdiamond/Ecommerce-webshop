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
        name: products.name,
        specifications: products.specifications,
        price: products.price,
        imageUrl: products.imageUrl,
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

    // return json({
    //   newestProducts: newestProducts.map((product) => ({
    //     ...product,
    //     id: product.id.toString(),
    //     specifications: product.specifications || [],
    //     price: product.price / 100,
    //     imageUrl: product.imageUrl || null,
    //     createdAt: product.createdAt.toISOString(),
    //   })),
    // });

    const mappedProducts = newestProducts.map((product) => ({
      id: product.id?.toString() ?? "N/A",
      name: product.name ?? "Unknown Product",
      specifications: product.specifications ?? [],
      price: product.price ? product.price / 100 : 0,
      imageUrl: product.imageUrl ?? "/default-image.jpg",
      createdAt: product.createdAt
        ? product.createdAt.toISOString()
        : new Date().toISOString(),
    }));

    console.log("Mapped newest products:", mappedProducts);

    return json({ newestProducts: mappedProducts });
  } catch (error) {
    return json({ error: "Failed to fetch newest products" }, { status: 500 });
  }
}
