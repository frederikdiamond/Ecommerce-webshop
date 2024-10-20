import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { ArrowIcon } from "~/components/Icons";
import { authenticator } from "~/services/auth.server";
import { db } from "~/db/index.server";
import { products, wishlistItems, wishlists } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { formatPrice } from "~/helpers/formatPrice";
import { Wishlist } from "~/types/WishlistTypes";
import MenuDots from "~/components/MenuDots";

interface LoaderData {
  wishlist: Wishlist | null;
  error?: string;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { slug } = params;
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json<LoaderData>(
      { wishlist: null, error: "User not authenticated" },
      { status: 401 },
    );
  }

  if (!slug) {
    return json<LoaderData>(
      { wishlist: null, error: "Invalid wishlist slug" },
      { status: 400 },
    );
  }

  try {
    const userWishlists = await db
      .select({
        id: wishlists.id,
        name: wishlists.name,
      })
      .from(wishlists)
      .where(eq(wishlists.userId, user.id));

    const matchingWishlist = userWishlists.find(
      (w) => w.name.toLowerCase().replace(/\s+/g, "-") === slug,
    );

    if (!matchingWishlist) {
      return json<LoaderData>(
        { wishlist: null, error: "Wishlist not found" },
        { status: 404 },
      );
    }

    const wishlistItemsResult = await db
      .select({
        wishlistItemId: wishlistItems.id,
        productId: wishlistItems.productId,
        productName: products.name,
        productSlug: products.slug,
        productPrice: products.price,
        productImages: products.images,
        productDescription: products.description,
        wishlistItemCreatedAt: wishlistItems.createdAt,
      })
      .from(wishlistItems)
      .innerJoin(products, eq(products.id, wishlistItems.productId))
      .where(eq(wishlistItems.wishlistId, matchingWishlist.id));

    const formattedWishlist: Wishlist = {
      id: matchingWishlist.id,
      name: matchingWishlist.name,
      slug: slug,
      items: wishlistItemsResult.map((row) => ({
        id: row.wishlistItemId,
        productId: row.productId,
        createdAt: new Date(row.wishlistItemCreatedAt),
        product: {
          name: row.productName,
          slug: row.productSlug,
          price: row.productPrice,
          images: row.productImages,
          description: row.productDescription,
        },
      })),
    };

    return json<LoaderData>({ wishlist: formattedWishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return json<LoaderData>(
      { wishlist: null, error: "Error fetching wishlist" },
      { status: 500 },
    );
  }
};

export default function WishlistDetails() {
  const { wishlist, error } = useLoaderData<LoaderData>();

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!wishlist) {
    return <div>Wishlist not found.</div>;
  }

  return (
    <div className="mx-auto mt-32 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to={"/my-wishlists"}
            className="group rounded-full p-1 transition duration-200 ease-in-out hover:bg-black/5 active:bg-black/10"
          >
            <ArrowIcon className="size-7 rotate-180 stroke-black stroke-[0.5px] opacity-50 transition duration-200 ease-in-out group-hover:opacity-100" />
          </Link>
          <h1 className="text-3xl font-bold">{wishlist.name}</h1>
        </div>

        <MenuDots />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {wishlist.items.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.product.slug}`}
            className="rounded-lg border border-gray-200 p-4 transition duration-200 ease-in-out hover:border-gray-300"
          >
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="mb-4 h-48 w-full rounded-md object-cover"
            />
            <h2 className="mb-2 text-xl font-semibold">{item.product.name}</h2>
            <p className="mb-2 text-gray-600">{item.product.description}</p>
            <p className="text-lg font-bold">
              {formatPrice(item.product.price)}
            </p>
          </Link>
        ))}

        {wishlist.items.length === 0 && <div className="">No items found.</div>}
      </div>
    </div>
  );
}
