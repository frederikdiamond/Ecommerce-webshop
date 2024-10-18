import { json, redirect } from "@remix-run/node";
import { Link, Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { db } from "~/db/index.server";
import { eq } from "drizzle-orm";
import { products, wishlistItems, wishlists } from "~/db/schema.server";
import { authenticator } from "~/services/auth.server";
import { useState } from "react";
import { CustomButton } from "~/components/Buttons";
import { Product } from "~/types/ProductTypes";

// interface WishlistItem {
//   id: string;
//   imageUrl: string;
//   name: string;
// }

// interface Wishlist {
//   id: string;
//   name: string;
//   slug: string;
//   items: WishlistItem[];
// }

interface LoaderData {
  shoppingWishlists: Wishlist[] | null;
  error?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json({ wishlists: null });
  }

  try {
    const rawShoppingWishlists = await db
      .select({
        id: wishlists.id,
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

    console.log(rawShoppingWishlists);

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
          images: row.productImages, // Assign imageUrl
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "createWishlist") {
    return redirect("/my-wishlists");
  }
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!shoppingWishlists || shoppingWishlists.length === 0) {
    return <div>No wishlists found.</div>;
  }

  return (
    <div className="mt-32 flex flex-col items-center">
      <div>
        <div className="flex w-[950px] items-center justify-between">
          <div className="flex items-start gap-3">
            <h1 className="text-4xl font-bold tracking-wide">MY WISHLISTS</h1>
            <p className="text-lg font-bold">[{shoppingWishlists.length}]</p>
          </div>
          <Form method="post">
            <CustomButton>Create New</CustomButton>

            {/* <button
              type="submit"
              name="intent"
              value="createWishlist"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Create New
            </button> */}
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
  );
}
