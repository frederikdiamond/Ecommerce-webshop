import {
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
import { and, eq, inArray } from "drizzle-orm";
import { db } from "~/db/index.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { CartItem } from "~/types/CartItemTypes";
import { CustomButton } from "~/components/Buttons";
import { Checkbox } from "~/components/Checkbox";
import { DropdownMenu } from "~/components//dropdown/DropdownMenu";
import { HeartIcon, TrashIcon } from "~/components/Icons";
import { CSSTransition } from "react-transition-group";
import "~/components/dropdown/dropdown-menu.css";

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
        specifications: products.specifications,
        images: products.images,
        quantity: shoppingCartItems.quantity,
        price: shoppingCartItems.price,
        category: productConfigurations.category,
        optionLabel: productOptions.optionLabel,
        optionId: productOptions.id,
        priceModifier: productOptions.priceModifier,
        isCustomizable: products.isCustomizable,
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
          specifications,
          images,
          quantity,
          price,
          category,
          optionLabel,
          optionId,
          priceModifier,
          isCustomizable,
        } = row;

        if (!acc[cartItemId]) {
          acc[cartItemId] = {
            cartItemId,
            product: {
              id: productId,
              name: name || undefined,
              slug: slug || undefined,
              specifications: specifications || [],
              images: images || [],
              isCustomizable: isCustomizable || false,
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

  if (action === "removeItems") {
    const cartItemIds = JSON.parse(formData.get("cartItemIds") as string);

    if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
      return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
      // Remove configurations first
      await db
        .delete(shoppingCartItemConfigurations)
        .where(inArray(shoppingCartItemConfigurations.cartItemId, cartItemIds));

      // Then remove the cart items
      await db
        .delete(shoppingCartItems)
        .where(
          and(
            inArray(shoppingCartItems.id, cartItemIds),
            eq(shoppingCartItems.userId, user.id),
          ),
        );

      return json({ success: true, message: "Items removed from cart" });
    } catch (error) {
      console.error("Error removing items from cart:", error);
      return json(
        { error: "Failed to remove items from cart" },
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
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
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

  const handleRemoveItem = (ids: number | number[]) => {
    const idsToRemove = Array.isArray(ids) ? ids : [ids];

    setItems((prevItems) =>
      prevItems.filter((item) => !idsToRemove.includes(item.cartItemId)),
    );

    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      idsToRemove.forEach((id) => newSelected.delete(id));
      return newSelected;
    });

    if (isGuest) {
      const updatedItems = items.filter(
        (item) => !idsToRemove.includes(item.cartItemId),
      );
      localStorage.setItem("shoppingCart", JSON.stringify(updatedItems));
    } else {
      fetcher.submit(
        {
          action: "removeItems",
          cartItemIds: JSON.stringify(idsToRemove),
        },
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

  const handleItemSelect = (itemId: number, isSelected: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(new Set(items.map((item) => item.cartItemId)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const dropdownItems = [
    {
      label: "Save to wishlist",
      icon: <HeartIcon className="size-4" />,
      onClick: () => {},
    },
    {
      label: "Remove from cart",
      icon: <TrashIcon className="size-4" />,
      onClick: () => handleRemoveItem(Array.from(selectedItems)),
    },
  ];

  return (
    <main className="mt-32 flex flex-col items-center">
      <div className="flex gap-10">
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-start gap-3">
              <h1 className="text-4xl font-bold tracking-wide">
                SHOPPING CART
              </h1>
              <p className="text-lg font-bold">[{totalItems}]</p>
            </div>
            <CSSTransition
              in={selectedItems.size > 0}
              timeout={150}
              classNames="dropdown"
              unmountOnExit
            >
              <DropdownMenu label="Options" items={dropdownItems} />
            </CSSTransition>
          </div>

          <div className="mt-10 flex gap-10">
            <div className="min-w-fit">
              <div>
                <div className="flex font-semibold">
                  <div className="flex w-[30px] items-center">
                    <Checkbox
                      selected={selectedItems.size === items.length}
                      onChange={handleSelectAll}
                      parentInput={true}
                    />
                  </div>
                  <p className="w-[350px] opacity-75">Product</p>
                  <p className="w-[120px] text-center opacity-75">Quantity</p>
                  <p className="w-[100px] text-right opacity-75">Price</p>
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
                    isSelected={selectedItems.has(item.cartItemId)}
                    onSelect={(isSelected) =>
                      handleItemSelect(item.cartItemId, isSelected)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-[90px] z-10 mt-[115px] flex h-fit w-[300px] flex-col gap-5 rounded-xl border border-black/10 bg-white p-3.5">
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
    </main>
  );
}
