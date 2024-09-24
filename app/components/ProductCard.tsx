import { Link } from "@remix-run/react";
import { formatPrice } from "~/helpers/formatPrice";

export default function ProductCard({
  productName,
  productDescription,
  productPrice,
  productImage,
}: {
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string;
}) {
  return (
    <Link to={"#"} className="group flex h-[300px] w-[250px] flex-col gap-2.5">
      <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
        <img
          src={productImage}
          alt=""
          className="transition duration-300 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="mx-2">
        <h3 className="text-lg font-bold group-hover:text-blue-500 group-hover:underline">
          {productName}
        </h3>
        <p className="opacity-50">{productDescription}</p>
        <p className="font-semibold">{formatPrice(productPrice)}</p>
      </div>
    </Link>
  );
}
