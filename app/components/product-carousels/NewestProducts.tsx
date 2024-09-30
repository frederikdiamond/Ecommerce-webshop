// import { useLoaderData } from "@remix-run/react";
import ProductCard from "../ProductCard";
import { Product } from "~/types/ProductTypes";

interface LatestProductsProps {
  products: Product[];
}

export default function NewestProducts({ products }: LatestProductsProps) {
  if (!products || products.length === 0) {
    return <div className="no-products-message">No newest products found.</div>;
  }

  return (
    <div>
      <h2 className="mb-3 text-2xl font-medium">Newest Products</h2>
      <div className="flex gap-5 overflow-x-auto pb-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            name={product.name}
            specifications={product.specifications || []}
            price={product.price}
            imageUrl={product.imageUrl || ""}
          />
        ))}
      </div>
    </div>
  );
}
