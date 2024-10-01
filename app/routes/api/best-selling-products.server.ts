import { json } from "@remix-run/node";
import { db } from "~/db/index.server";
import { products, orderItems } from "~/db/schema.server";
import { eq, desc } from "drizzle-orm";

export async function loader() {
  try {
    const bestSellingProducts = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        specifications: products.specifications,
        price: products.price,
        images: products.images,
        totalSold: products.totalSold,
      })
      .from(products)
      .innerJoin(orderItems, eq(products.id, orderItems.productId))
      .groupBy(products.id)
      .orderBy(desc(products.totalSold))
      .limit(10);

    if (!bestSellingProducts || bestSellingProducts.length === 0) {
      return json({ bestSellingProducts: [] });
    }

    return json({
      bestSellingProducts: bestSellingProducts.map((product) => ({
        ...product,
        id: product.id.toString(),
        specifications: product.specifications || [],
        price: product.price / 100,
        images: product.images || null,
      })),
    });
  } catch (error) {
    return json(
      { error: "Failed to fetch best selling products" },
      { status: 500 },
    );
  }
}
