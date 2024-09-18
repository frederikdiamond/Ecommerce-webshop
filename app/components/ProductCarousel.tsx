import ProductCard from "./ProductCard";

export default function ProductCarousel({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <div>
      <h2 className="text-2xl font-medium">{title}</h2>
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
