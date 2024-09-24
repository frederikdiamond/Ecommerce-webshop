import { useState } from "react";
import ShoppingCartItem from "./ShoppingCartItem";
import { Product } from "~/types/ProductTypes";
import { formatPrice } from "~/helpers/formatPrice";
// import { CloseIcon, HeartIcon, MinusIcon, PlusIcon } from "~/components/Icons";

export default function ShoppingCart({
  userAddress,
}: {
  userAddress: string | null;
}) {
  const [items, setItems] = useState<Product[]>([
    {
      id: 1,
      name: 'MacBook Pro 16"',
      specs: ["Apple M3 Max", "36GB memory", "512GB storage"],
      price: 3299.0,
      quantity: 1,
    },
    {
      id: 2,
      name: 'MacBook Pro 14"',
      specs: ["Apple M3 Pro", "18GB memory", "512GB storage"],
      price: 2399.0,
      quantity: 2,
    },
  ]);

  const shippingCost = 50.0;

  const handleQuantityChange = (id: number, newQuantity: number): void => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item,
      ),
    );
  };

  const handleRemoveItem = (id: number): void => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculateSubtotal = (): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGrandTotal = (): number => {
    const subtotal = calculateSubtotal();
    return userAddress ? subtotal + shippingCost : subtotal;
  };

  userAddress = "Hello";

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="mt-32 flex flex-col items-center">
      <div className="flex flex-col items-start">
        <div className="flex items-start gap-3">
          <h1 className="text-4xl font-bold tracking-wide">SHOPPING CART</h1>
          {/* Total products counter */}
          <p className="text-lg font-bold">[{totalItems}]</p>
        </div>
        <div className="mt-10 flex gap-10">
          <div className="min-w-fit">
            <div>
              <div className="flex font-semibold opacity-75">
                <p className="w-[350px]">Product</p>
                <p className="w-[120px] text-center">Quantity</p>
                <p className="w-[100px] text-right">Price</p>
              </div>
              <div className="mt-2.5 border border-black/10" />
              {items.map((item) => (
                <ShoppingCartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>
          <div className="mt-[34px] flex w-[300px] flex-col gap-5 rounded-xl border border-black/10 p-3.5">
            {/* Discount code */}
            <div></div>

            {/* Subtotal */}
            <div className="flex justify-between">
              <span className="opacity-50">Subtotal</span>
              <span className="font-semibold">
                {formatPrice(calculateSubtotal())}
              </span>
            </div>

            {/* Shipping */}
            {userAddress ? (
              <div className="flex justify-between">
                <span className="opacity-50">Shipping</span>
                <p className="text-right opacity-50">Address required.</p>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="opacity-50">Shipping</span>
                <span className="text-right">{formatPrice(shippingCost)}</span>
              </div>
            )}

            {/* Grand Total */}
            <div className="flex justify-between">
              <p>Grand Total</p>
              <span className="text-right text-lg font-bold">
                {formatPrice(calculateGrandTotal())}
              </span>
              {/* <span className="text-right">
                {calculateGrandTotal() !== null ? (
                  <span className="text-lg font-bold">
                    {formatPrice(calculateGrandTotal())}
                  </span>
                ) : (
                  "Address required"
                )}
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
