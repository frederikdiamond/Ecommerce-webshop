import { useLoaderData } from "@remix-run/react";
import ProductCard from "../ProductCard";

interface Product {
  id: number;
  name: string;
  specifications: string[];
  price: number;
  imageUrl: string;
  totalSold: number;
}

export default function BestSellingProducts() {
  const { bestSellingProducts } = useLoaderData<{
    bestSellingProducts: Product[];
  }>();

  return (
    <div>
      <h2 className="mb-3 text-2xl font-medium">Best Selling</h2>
      <div className="flex gap-5 overflow-x-auto pb-4">
        {bestSellingProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            name={product.name}
            specifications={product.specifications || []}
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
