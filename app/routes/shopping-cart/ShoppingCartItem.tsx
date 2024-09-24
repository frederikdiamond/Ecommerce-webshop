import { Link } from "@remix-run/react";
import { MinusIcon, PlusIcon, HeartIcon, TrashIcon } from "~/components/Icons";
import { formatPrice } from "~/helpers/formatPrice";
import { Product } from "~/types/ProductTypes";

export default function ShoppingCartItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: Product;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="my-5 flex">
      <div className="flex w-[350px] gap-4">
        <img src="" alt="" className="size-32 rounded-xl" />
        <div className="mt-3">
          <Link
            to={"#"}
            className="text-lg font-bold hover:text-blue-500 hover:underline"
          >
            {item.name}
          </Link>
          {item.specs.map((spec, index) => (
            <p key={index} className="text-sm opacity-50">
              {spec}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-3 flex w-[120px] flex-col items-center gap-5">
        <div className="flex gap-2">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="flex size-7 items-center justify-center rounded-full fill-black/50 transition duration-200 hover:bg-black/10 hover:fill-black disabled:cursor-not-allowed disabled:bg-transparent disabled:hover:fill-black/50"
          >
            <MinusIcon className="size-4" />
          </button>
          <p className="font-medium">{item.quantity}</p>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="flex size-7 items-center justify-center rounded-full opacity-50 transition duration-200 hover:bg-black/10 hover:opacity-100"
          >
            <PlusIcon className="size-6" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          {/* Add tooltips */}
          <button className="rounded-full fill-black/30 p-1.5 transition duration-200 hover:fill-blue-500 active:bg-black/5">
            <HeartIcon className="size-5" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="h-fit rounded-full fill-black/30 p-1.5 transition duration-200 hover:fill-red-500 active:bg-black/5"
          >
            <TrashIcon className="size-5" />
          </button>
        </div>
      </div>
      <div className="mt-3 w-[100px] text-right">
        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}
