import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useEffect, useState } from "react";
import ShoppingCartItem from "./ShoppingCartItem";
import { Product } from "~/types/ProductTypes";
import { formatPrice } from "~/helpers/formatPrice";
import {
  productOptions,
  products,
  shoppingCartItemConfigurations,
  shoppingCartItems,
} from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { db } from "~/db/index.server";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
// import { CloseIcon, HeartIcon, MinusIcon, PlusIcon } from "~/components/Icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json({ cart: null });
  }

  try {
    const cartItems = await db
      .select({
        cartItemId: shoppingCartItems.id,
        productId: shoppingCartItems.productId,
        name: products.name,
        quantity: shoppingCartItems.quantity,
        price: shoppingCartItems.price,
        configLabel: productOptions.optionLabel,
        configPriceModifier: productOptions.priceModifier,
      })
      .from(shoppingCartItems)
      .leftJoin(products, eq(shoppingCartItems.productId, products.id))
      .leftJoin(
        shoppingCartItemConfigurations,
        eq(shoppingCartItems.id, shoppingCartItemConfigurations.cartItemId),
      )
      .leftJoin(
        productOptions,
        eq(shoppingCartItemConfigurations.configurationId, productOptions.id),
      )
      .where(eq(shoppingCartItems.userId, user.id));

    console.log("Fetched cart items: ", cartItems);

    const groupedCart = cartItems.reduce((acc: any, row: any) => {
      const {
        cartItemId,
        productId,
        name,
        quantity,
        price,
        configLabel,
        configPriceModifier,
      } = row;

      if (!acc[cartItemId]) {
        acc[cartItemId] = {
          cartItemId,
          productId,
          name,
          quantity,
          price,
          configurations: [],
        };
      }

      acc[cartItemId].configurations.push({
        configLabel,
        configPriceModifier,
      });

      return acc;
    }, {});

    const cart = Object.values(groupedCart);

    return json({ cart });
  } catch (error) {
    console.error("Error fetching shopping cart: ", error);
    return json({ cart: null, error: "Error fetching shopping cart" });
  }
};

export interface CartItem {
  cartItemId: number;
  product: Product;
  quantity: number;
  price: number;
  configurations: {
    configLabel: string;
    configPriceModifier: number;
  }[];
}

export default function ShoppingCart({
  userAddress,
}: {
  userAddress: string | null;
}) {
  const { cart } = useLoaderData<{ cart: CartItem[] }>();
  const [items, setItems] = useState<CartItem[]>(cart || []);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    if (cart) {
      setItems(cart);
    } else {
      const storedCart = localStorage.getItem("shoppingCart");
      if (storedCart) {
        setItems(JSON.parse(storedCart));
        setIsGuest(true);
      }
    }
  }, [cart]);

  const handleQuantityChange = (id: number, newQuantity: number): void => {
    const updatedItems = items.map((item) =>
      item.cartItemId === id
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item,
    );
    setItems(updatedItems);

    if (isGuest) {
      localStorage.setItem("shoppingCart", JSON.stringify(updatedItems));
    }
  };

  const handleRemoveItem = (id: number): void => {
    const updatedItems = items.filter((item) => item.cartItemId !== id);
    setItems(updatedItems);

    if (isGuest) {
      localStorage.setItem("shoppingCart", JSON.stringify(updatedItems));
    }
  };

  const calculateSubtotal = (): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGrandTotal = (): number => {
    const subtotal = calculateSubtotal();
    const shippingCost = 5000; // Fixed for testing purposes
    return userAddress ? subtotal + shippingCost : subtotal;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const shippingCost = 5000; // Fixed for testing purposes

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
                  key={item.cartItemId}
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
