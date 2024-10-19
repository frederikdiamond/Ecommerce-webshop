/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { json } from "@remix-run/node";
import { Link, Form, useLoaderData, useActionData } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { db } from "~/db/index.server";
import { eq } from "drizzle-orm";
import { products, wishlistItems, wishlists } from "~/db/schema.server";
import { authenticator } from "~/services/auth.server";
import { useEffect, useRef, useState } from "react";
import { CustomButton } from "~/components/Buttons";
import { Product } from "~/types/ProductTypes";
import CreateWishlist from "./CreateWishlist";

interface LoaderData {
  shoppingWishlists: Wishlist[] | null;
  error?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json<LoaderData>({ shoppingWishlists: null });
  }

  try {
    const rawShoppingWishlists = await db
      .select({
        wishlistId: wishlists.id,
        userId: wishlists.userId,
        wishlistName: wishlists.name,
        wishlistcreatedAt: wishlists.createdAt,
        wishlistupdatedAt: wishlists.updatedAt,
        wishlistItemId: wishlistItems.id,
        productId: wishlistItems.productId,
        productImages: products.images,
        wishlistItemCreatedAt: wishlistItems.createdAt,
      })
      .from(wishlists)
      .innerJoin(wishlistItems, eq(wishlistItems.wishlistId, wishlists.id))
      .innerJoin(products, eq(products.id, wishlistItems.productId))
      .where(eq(wishlists.userId, user.id));

    const wishlistsMap: { [key: number]: Wishlist } = {};

    rawShoppingWishlists.forEach((row) => {
      if (!wishlistsMap[row.wishlistId]) {
        wishlistsMap[row.wishlistId] = {
          id: row.wishlistId,
          userId: row.userId,
          name: row.wishlistName,
          createdAt: new Date(row.wishlistCreatedAt),
          updatedAt: new Date(row.wishlistUpdatedAt),
          items: [],
        };
      }

      wishlistsMap[row.wishlistId].items.push({
        id: row.wishlistItemId,
        productId: row.productId,
        createdAt: new Date(row.wishlistItemCreatedAt),
        product: {
          name: row.productName,
          price: parseFloat(row.productPrice),
          images: row.productImages,
        },
      });
    });

    const shoppingWishlists: Wishlist[] = Object.values(wishlistsMap);

    return json<LoaderData>({ shoppingWishlists });
  } catch (error) {
    console.error(error);
    return json<LoaderData>({
      shoppingWishlists: null,
      error: "Error fetching wishlists",
    });
  }
};

interface ActionData {
  errors?: {
    wishlistName?: string;
    general?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json<ActionData>(
      { errors: { general: "You must be logged in to create a wishlist." } },
      { status: 401 },
    );
  }

  if (intent === "createWishlist") {
    const wishlistName = formData.get("wishlistName");

    if (typeof wishlistName !== "string" || wishlistName.trim() === "") {
      return json<ActionData>(
        { errors: { wishlistName: "Wishlist name is required." } },
        { status: 400 },
      );
    }

    try {
      await db.insert(wishlists).values({
        userId: user.id,
        name: wishlistName.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return json({ success: true });
    } catch (error) {
      console.error("Error creating wishlist:", error);
      return json<ActionData>(
        {
          errors: {
            general: "Something went wrong while creating the wishlist.",
          },
        },
        { status: 500 },
      );
    }
  }

  return json<ActionData>(
    { errors: { general: "Invalid form submission." } },
    { status: 400 },
  );
};

interface Wishlist {
  wishlistId: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: WishlistItem[];
}

interface WishlistItem {
  id: number;
  productId: number;
  createdAt: Date;
  product: Product;
}

export default function Wishlist() {
  const { shoppingWishlists, error } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const [showCreateWishlist, setShowCreateWishlist] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (actionData?.success) {
      setShowCreateWishlist(false);
    }
  }, [actionData]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseCreateWishlist();
      }
    };

    if (showCreateWishlist) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [showCreateWishlist]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!shoppingWishlists || shoppingWishlists.length === 0) {
    return <div>No wishlists found.</div>;
  }

  const handleOpenCreateWishlist = () => {
    setShowCreateWishlist(true);
  };

  const handleCloseCreateWishlist = () => {
    setShowCreateWishlist(false);

    if (openButtonRef.current) {
      openButtonRef.current.focus();
    }
  };

  return (
    <>
      <div className="mt-32 flex flex-col items-center">
        <div>
          <div className="flex w-[950px] items-center justify-between">
            <div className="flex items-start gap-3">
              <h1 className="text-4xl font-bold tracking-wide">MY WISHLISTS</h1>
              <p className="text-lg font-bold">[{shoppingWishlists.length}]</p>
            </div>
            <Form method="post">
              <CustomButton onClick={handleOpenCreateWishlist}>
                Create New
              </CustomButton>
            </Form>
          </div>

          <div className="mt-5 flex flex-col">
            {shoppingWishlists.map((wishlists, index) => (
              <div key={wishlists.wishlistId}>
                <Link
                  to={"#"}
                  // to={`/my-wishlists/${wishlist.slug}`}
                  className="group block py-4"
                >
                  <h2 className="text-xl font-semibold group-hover:text-blue-500">
                    {wishlists.name}
                  </h2>
                  <p className="text-sm opacity-75">
                    {wishlists.items.length}{" "}
                    {wishlists.items.length > 1 ? "items" : "item"}
                  </p>
                  <div className="mt-2 flex gap-2.5">
                    {wishlists.items.slice(0, 4).map((item) => (
                      <img
                        key={item.productId}
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="size-28 rounded-xl object-cover"
                      />
                    ))}
                  </div>
                </Link>
                {index < shoppingWishlists.length - 1 && (
                  <div className="h-px w-full bg-black/10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateWishlist && (
        <div
          onClick={handleCloseCreateWishlist}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <CreateWishlist close={handleCloseCreateWishlist} />
        </div>
      )}
    </>
  );
}
