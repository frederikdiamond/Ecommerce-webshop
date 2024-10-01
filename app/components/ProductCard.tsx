import { Link } from "@remix-run/react";
import { formatPrice } from "~/helpers/formatPrice";

export default function ProductCard({
  id,
  slug,
  name,
  specifications,
  price,
  images,
}: {
  id: string;
  slug: string;
  name: string;
  specifications: string[];
  price: number;
  images: string;
}) {
  return (
    <Link
      key={id}
      to={`/product/${slug}`}
      className="group flex flex-col gap-2.5"
    >
      <div className="relative flex h-[150px] w-[250px] items-center justify-center overflow-hidden rounded-xl">
        <img
          src={images}
          alt=""
          className="max-h-full transition duration-300 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="mx-2 h-[150px]">
        <h3 className="text-lg font-bold group-hover:text-blue-500 group-hover:underline">
          {name}
        </h3>
        <ul className="mt-0.5 list-disc pl-5 text-sm opacity-75">
          {specifications.slice(0, 2).map((spec, index) => (
            <li key={index}>{spec}</li>
          ))}
        </ul>
        <p className="mt-2 font-semibold">{formatPrice(price)}</p>
      </div>
    </Link>
  );
}
