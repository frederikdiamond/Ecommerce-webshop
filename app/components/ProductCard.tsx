export default function ProductCard({
  productName,
  productDescription,
  productPrice,
}: {
  productName: string;
  productDescription: string;
  productPrice: number;
}) {
  return (
    <div>
      <img src="" alt="" />
      <div>
        <h3 className="text-xl font-bold hover:text-blue-500 hover:underline">
          {productName}
        </h3>
        <p>{productDescription}</p>
        <p className="font-medium">{productPrice}</p>
      </div>
    </div>
  );
}
