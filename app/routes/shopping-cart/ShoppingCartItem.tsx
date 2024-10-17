import { Link } from "@remix-run/react";
import { Checkbox } from "~/components/Checkbox";
import { MinusIcon, PlusIcon, HeartIcon, TrashIcon } from "~/components/Icons";
import { formatPrice } from "~/helpers/formatPrice";
import { CartItem } from "~/types/CartItemTypes";
import {
  useProductConfiguration,
  constructProductUrl,
  SelectedConfigurations,
} from "~/utils/productConfigurationUtil";
import { getProductImage } from "~/utils/productImage";

export default function ShoppingCartItem({
  item,
  onQuantityChange,
  onRemove,
  isSelected,
  onSelect,
}: {
  item: CartItem;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}) {
  const { product } = item;
  const productName = item.product?.name || "Unnamed Product";
  const baseSlug = item.product?.slug;

  const initialConfigurations: SelectedConfigurations =
    item.configurations.reduce((acc, config) => {
      acc[config.category] = {
        label: config.optionLabel,
        price: config.priceModifier,
        id: config.optionId,
      };
      return acc;
    }, {} as SelectedConfigurations);

  const { getDisplaySpecifications } = useProductConfiguration(
    item.product,
    item.product.configurations || [],
    initialConfigurations,
  );

  const productUrl = constructProductUrl(baseSlug, initialConfigurations);
  const displaySpecifications = getDisplaySpecifications();
  const productImage = getProductImage(product);

  return (
    <div className="my-5 flex">
      <div className="my-auto w-[30px]">
        <Checkbox selected={isSelected} onChange={onSelect} />
      </div>
      <div className="flex w-[350px] gap-4">
        <img
          src={productImage}
          alt={productName}
          className="size-32 rounded-xl object-contain"
        />
        <div className="mt-3">
          <Link
            to={productUrl}
            className="text-lg font-bold hover:text-blue-500 hover:underline"
          >
            {productName}
          </Link>

          <ul className="list-disc pl-5 text-sm leading-loose opacity-75">
            {item.product.isCustomizable && item.configurations.length > 0
              ? item.configurations.map((config, index) => (
                  <li
                    key={index}
                  >{`${config.category}: ${config.optionLabel}`}</li>
                ))
              : displaySpecifications.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
          </ul>
        </div>
      </div>
      <div className="mt-3 flex w-[120px] flex-col items-center gap-5">
        <div className="flex gap-2">
          <button
            onClick={() => onQuantityChange(item.cartItemId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="flex size-7 items-center justify-center rounded-full fill-black/50 transition duration-200 hover:bg-black/10 hover:fill-black disabled:cursor-not-allowed disabled:bg-transparent disabled:hover:fill-black/50"
          >
            <MinusIcon className="size-4" />
          </button>
          <p className="font-medium">{item.quantity}</p>
          <button
            onClick={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
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
            onClick={() => onRemove(item.cartItemId)}
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
