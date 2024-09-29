import { json } from "@remix-run/node";
import { db } from "~/db/index.server";
import { products, orderItems } from "~/db/schema.server";
import { eq, desc, sum } from "drizzle-orm";

export async function loader() {
  const bestSellingProducts = await db
    .select({
      id: products.id,
      name: products.name,
      specifications: products.specifications,
      price: products.price,
      imageUrl: products.imageUrl,
      totalSold: sum(orderItems.quantity).as("totalSold"),
    })
    .from(products)
    .innerJoin(orderItems, eq(products.id, orderItems.productId))
    .groupBy(products.id)
    .orderBy(desc("totalSold"))
    .limit(5);

  return json({
    bestSellingProducts: bestSellingProducts.map((product) => ({
      ...product,
      id: product.id.toString(),
      specifications: product.specifications || [],
      price: product.price / 100, // Convert cents to dollars if necessary
    })),
  });
}
