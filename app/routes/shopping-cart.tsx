import { useState } from "react";
import { MinusIcon, PlusIcon } from "~/components/Icons";

export default function ShoppingCart({
  productName,
  productDescription,
  productSpecifications,
  productPrice,
  productImages,
}: {
  productName: string;
  productDescription: string;
  productSpecifications: string[];
  productPrice: number;
  productImages: string[];
}) {
  const [productItemQuantity, setProductItemQuantity] = useState(0);

  return (
    <main className="mt-32 flex flex-col items-center">
      <div className="w-[950px]">
        <div className="flex items-start gap-3">
          <h1 className="text-4xl font-bold tracking-wide">SHOPPING CART</h1>
          {/* Total products counter */}
          <p className="text-lg font-bold">[3]</p>
        </div>
        <div>
          <div className="flex font-semibold opacity-75">
            <p>Product</p>
            <p>Quatity</p>
            <p>Price</p>
          </div>
          <div className="flex">
            <img src="" alt="" className="size-32 rounded-xl" />
            <div>
              <h2 className="text-lg font-bold">{productName}</h2>
              <p className="opacity-50">{productDescription}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex size-7 items-center justify-center rounded-full opacity-50 transition duration-200 hover:bg-black/10 hover:opacity-100">
                <MinusIcon className="size-4" />
              </button>
              <p className="font-medium">{productItemQuantity}</p>
              <button className="flex size-7 items-center justify-center rounded-full opacity-50 transition duration-200 hover:bg-black/10 hover:opacity-100">
                <PlusIcon className="size-6" />
              </button>
            </div>
            <p className="font-medium">{productPrice}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
