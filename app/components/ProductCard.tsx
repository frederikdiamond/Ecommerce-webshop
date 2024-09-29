import { Link } from "@remix-run/react";
import { formatPrice } from "~/helpers/formatPrice";

export default function ProductCard({
  id,
  name,
  specifications,
  price,
  imageUrl,
}: {
  id: string;
  name: string;
  specifications: string[];
  price: number;
  imageUrl: string;
}) {
  return (
    <Link key={id} to={"#"} className="group flex w-[250px] flex-col gap-2.5">
      <div className="relative flex h-[150px] w-full items-center justify-center overflow-hidden rounded-xl">
        <img
          src={imageUrl}
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
