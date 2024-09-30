import ProductCard from "../ProductCard";

interface Product {
  id: number;
  name: string;
  specifications: string[];
  price: number;
  imageUrl: string;
  totalSold: number;
}

interface Props {
  products: Product[];
}

export default function BestSellingProducts({ products }: Props) {
  if (!products || products.length === 0) {
    return (
      <div className="no-products-message">No best selling products found.</div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-2xl font-medium">Best Selling</h2>
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
