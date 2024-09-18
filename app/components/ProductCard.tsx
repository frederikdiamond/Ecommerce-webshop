export default function ProductCard({
  name,
  description,
  price,
}: {
  name: string;
  description: string;
  price: number;
}) {
  return (
    <div>
      <img src="" alt="" />
      <div>
        <h3 className="text-xl font-bold">{name}</h3>
        <p>{description}</p>
        <p className="font-medium">{price}</p>
      </div>
    </div>
  );
}
