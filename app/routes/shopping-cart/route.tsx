import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useEffect, useState } from "react";
import ShoppingCartItem from "./ShoppingCartItem";
import { formatPrice } from "~/helpers/formatPrice";
import {
  productConfigurations,
  productOptions,
  products,
  shoppingCartItemConfigurations,
  shoppingCartItems,
} from "~/db/schema.server";
import { and, eq } from "drizzle-orm";
import { db } from "~/db/index.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { Product } from "~/types/ProductTypes";
import { CartItem } from "~/types/CartItemTypes";
import { CustomButton } from "~/components/Buttons";
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
        slug: products.slug,
        images: products.images,
        quantity: shoppingCartItems.quantity,
        price: shoppingCartItems.price,
        category: productConfigurations.category,
        optionLabel: productOptions.optionLabel,
        optionId: productOptions.id,
        priceModifier: productOptions.priceModifier,
      })
      .from(shoppingCartItems)
      .leftJoin(products, eq(shoppingCartItems.productId, products.id))
      .leftJoin(
        shoppingCartItemConfigurations,
        eq(shoppingCartItems.id, shoppingCartItemConfigurations.cartItemId),
      )
      .leftJoin(
        productOptions,
        eq(shoppingCartItemConfigurations.optionId, productOptions.id),
      )
      .leftJoin(
        productConfigurations,
        eq(productOptions.configurationId, productConfigurations.id),
      )
      .where(eq(shoppingCartItems.userId, user.id));

    const groupedCart = cartItems.reduce(
      (acc: Record<number, CartItem>, row) => {
        const {
          cartItemId,
          productId,
          name,
          slug,
          images,
          quantity,
          price,
          category,
          optionLabel,
          optionId,
          priceModifier,
        } = row;

        if (!acc[cartItemId]) {
          acc[cartItemId] = {
            cartItemId,
            product: {
              id: productId,
              name: name || undefined,
              slug: slug || undefined,
              images: images || [],
            },
            quantity,
            price,
            configurations: [],
          };
        }

        if (category && optionLabel && optionId !== undefined) {
          acc[cartItemId].configurations.push({
            category,
            optionLabel,
            optionId,
            priceModifier,
          });
        }

        return acc;
      },
      {},
    );

    const cart = Object.values(groupedCart);

    return json({ cart });
  } catch (error) {
    console.error("Error fetching shopping cart: ", error);
    return json({ cart: null, error: "Error fetching shopping cart" });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "removeItem") {
    const cartItemId = formData.get("cartItemId");

    if (!cartItemId) {
      return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
      // Remove configurations first
      await db
        .delete(shoppingCartItemConfigurations)
        .where(
          eq(shoppingCartItemConfigurations.cartItemId, Number(cartItemId)),
        );

      // Then remove the cart item
      await db
        .delete(shoppingCartItems)
        .where(
          and(
            eq(shoppingCartItems.id, Number(cartItemId)),
            eq(shoppingCartItems.userId, user.id),
          ),
        );

      return json({ success: true, message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      return json(
        { error: "Failed to remove item from cart" },
        { status: 500 },
      );
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function ShoppingCart({
  userAddress,
}: {
  userAddress: string | null;
}) {
  const { cart, error } = useLoaderData<{
    cart: CartItem[] | null;
    error?: string;
  }>();
  const fetcher = useFetcher();
  const [items, setItems] = useState<CartItem[]>([]);
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
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === id
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item,
      ),
    );

    if (isGuest) {
      localStorage.setItem("shoppingCart", JSON.stringify(items));
    }
  };

  const handleRemoveItem = (id: number): void => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== id));

    if (isGuest) {
      localStorage.setItem(
        "shoppingCart",
        JSON.stringify(items.filter((item) => item.cartItemId !== id)),
      );
    } else {
      fetcher.submit(
        { action: "removeItem", cartItemId: id.toString() },
        { method: "post" },
      );
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

              {items && items.length === 0 && (
                <p className="mt-10 h-[200vh] text-center text-lg font-medium">
                  Your shopping cart is empty.
                </p>
              )}

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
          <div className="sticky top-[90px] z-10 mt-[35px] flex h-fit w-[300px] flex-col gap-5 rounded-xl border border-black/10 bg-white p-3.5">
            {/* Discount code */}
            <div className="flex justify-between gap-2">
              <span className="text-nowrap opacity-50">Discount Code</span>
              <input
                type="text"
                placeholder="Type here..."
                className="w-[150px] text-right placeholder:text-black/50 focus:outline-none"
              />
            </div>

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

            <CustomButton
              disabled={items.length === 0}
              className={`mt-2.5 ${items.length === 0 ? "cursor-not-allowed opacity-50 hover:scale-100 active:scale-100" : ""}`}
            >
              Checkout Now
            </CustomButton>
          </div>
        </div>
      </div>
    </main>
  );
}
