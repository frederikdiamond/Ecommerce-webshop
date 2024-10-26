import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { ArrowIcon } from "~/components/Icons";
import { authenticator } from "~/services/auth.server";
import { db } from "~/db/index.server";
import {
  productConfigurations,
  productOptions,
  products,
  wishlistItems,
  wishlists,
} from "~/db/schema.server";
import { and, eq, inArray } from "drizzle-orm";
import { formatPrice } from "~/helpers/formatPrice";
import { Wishlist } from "~/types/WishlistTypes";
import { MenuDots } from "~/components/MenuDots";
import { useEffect, useState } from "react";
import { ConfigCategory, ConfigOption } from "~/types/ConfigTypes";

interface LoaderData {
  wishlist: Wishlist | null;
  error?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const formData = await request.formData();
  const action = formData.get("action");
  const wishlistId = formData.get("wishlistId");

  if (!user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

  if (!wishlistId) {
    return json({ error: "Invalid wishlist ID" }, { status: 400 });
  }

  const [wishlist] = await db
    .select()
    .from(wishlists)
    .where(
      and(eq(wishlists.id, Number(wishlistId)), eq(wishlists.userId, user.id)),
    );

  if (!wishlist) {
    return json({ error: "Wishlist not found" }, { status: 404 });
  }

  try {
    switch (action) {
      case "deleteWishlist":
        await db
          .delete(wishlistItems)
          .where(eq(wishlistItems.wishlistId, Number(wishlistId)));

        await db.delete(wishlists).where(eq(wishlists.id, Number(wishlistId)));
        return json({
          success: true,
          message: "Wishlist deleted successfully",
          navi,
        });

      case "renameWishlist": {
        const newName = formData.get("name");

        if (!newName || typeof newName !== "string") {
          return json({ error: "New name is required" }, { status: 400 });
        }

        const trimmedNewName = newName.trim();

        if (trimmedNewName.length === 0) {
          return json({ error: "Name cannot be empty" }, { status: 400 });
        }

        if (trimmedNewName === wishlist.name) {
          return json({
            success: true,
            message: "No changes needed - name is the same",
            noUpdate: true,
          });
        }

        const newSlug = trimmedNewName.toLowerCase().replace(/\s+/g, "-");

        await db
          .update(wishlists)
          .set({ name: newName })
          .where(eq(wishlists.id, Number(wishlistId)));

        return json({
          success: true,
          message: "Wishlist renamed successfully",
          newName: trimmedNewName,
          newSlug,
        });
      }

      case "shareWishlist": {
        // Will implement sharing logic later
        return json({ error: "Sharing not implemented yet" }, { status: 501 });
      }

      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return json({ error }, { status: 500 });
  }
};

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
    const wishlistDetails = await db
      .select({
        wishlistId: wishlists.id,
        userId: wishlists.userId,
        name: wishlists.name,
        createdAt: wishlists.createdAt,
        updatedAt: wishlists.updatedAt,
      })
      .from(wishlists)
      .where(eq(wishlists.userId, user.id));

    const matchingWishlist = wishlistDetails.find(
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
        productId: products.id,
        productName: products.name,
        productSlug: products.slug,
        productPrice: products.price,
        productBasePrice: products.basePrice,
        productImages: products.images,
        productDescription: products.description,
        productSpecifications: products.specifications,
        productQuantity: products.stock,
        productTotalSold: products.totalSold,
        wishlistItemCreatedAt: wishlistItems.createdAt,
      })
      .from(wishlistItems)
      .innerJoin(products, eq(products.id, wishlistItems.productId))
      .where(eq(wishlistItems.wishlistId, matchingWishlist.wishlistId));

    const productIds = wishlistItemsResult.map((item) => item.productId);
    const configurations = await db
      .select({
        productId: productConfigurations.productId,
        category: productConfigurations.category,
        optionId: productOptions.id,
        optionLabel: productOptions.optionLabel,
        priceModifier: productOptions.priceModifier,
        isDefault: productOptions.isDefault,
      })
      .from(productConfigurations)
      .leftJoin(
        productOptions,
        eq(productOptions.configurationId, productConfigurations.id),
      )
      .where(inArray(productConfigurations.productId, productIds));

    const configsByProduct = configurations.reduce(
      (acc, conf) => {
        if (
          !conf.optionId ||
          !conf.optionLabel ||
          conf.priceModifier === null
        ) {
          return acc;
        }

        if (!acc[conf.productId]) {
          acc[conf.productId] = {};
        }
        if (!acc[conf.productId][conf.category]) {
          acc[conf.productId][conf.category] = {
            name: conf.category,
            options: [],
            defaultOption: null,
          };
        }

        const option: ConfigOption = {
          id: conf.optionId,
          label: conf.optionLabel,
          price: conf.priceModifier,
        };

        acc[conf.productId][conf.category].options.push(option);
        if (conf.isDefault) {
          acc[conf.productId][conf.category].defaultOption = option;
        }

        return acc;
      },
      {} as Record<number, Record<string, ConfigCategory>>,
    );

    const formattedWishlist: Wishlist = {
      wishlistId: matchingWishlist.wishlistId,
      userId: matchingWishlist.userId,
      name: matchingWishlist.name,
      slug: slug,
      createdAt: matchingWishlist.createdAt,
      updatedAt: matchingWishlist.updatedAt,

      items: wishlistItemsResult.map((row) => ({
        id: row.wishlistItemId,
        productId: row.productId,
        createdAt: new Date(row.wishlistItemCreatedAt),
        product: {
          id: row.productId,
          name: row.productName,
          slug: row.productSlug,
          description: row.productDescription || "",
          specifications: row.productSpecifications as string[],
          price: row.productPrice,
          basePrice: row.productBasePrice,
          images: row.productImages as string[],
          quantity: row.productQuantity,
          totalSold: row.productTotalSold,
          configurations: Object.values(configsByProduct[row.productId] || {}),
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
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("second");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.error) {
        setErrorMessage(fetcher.data.error);
      } else if (fetcher.data.success) {
        setErrorMessage(null);

        if (fetcher.data.noUpdate) {
          setIsRenaming(false);
        } else {
          if (fetcher.data.newSlug) {
            navigate(`/my-wishlists/${fetcher.data.newSlug}`, {
              replace: true,
            });
          }
          setIsRenaming(false);
        }
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const handleRenameWishlist = () => {
    setIsRenaming(true);
    setNewName(wishlist?.name || "");
    setErrorMessage(null);
  };

  const submitRename = () => {
    const trimmedName = newName.trim();
    if (trimmedName && wishlist) {
      fetcher.submit(
        {
          action: "renameWishlist",
          wishlistId: wishlist.wishlistId.toString(),
          name: trimmedName,
        },
        { method: "post" },
      );
      setIsRenaming(false);
    }
  };

  const handleRemoveWishlist = () => {
    if (
      window.confirm("Are you sure you want to delete this wishlist?") &&
      wishlist
    ) {
      fetcher.submit(
        {
          action: "deleteWishlist",
          wishlistId: wishlist.wishlistId.toString(),
        },
        { method: "post" },
      );
    }
  };

  const dropdownItems = [
    {
      label: "Share",
      onClick: () => {},
    },
    {
      label: "Rename",
      onClick: handleRenameWishlist,
    },
    {
      label: "Remove",
      onClick: handleRemoveWishlist,
    },
  ];

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
          {isRenaming ? (
            <div className="flex items-center gap-5">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={`rounded-md border-2 border-gray-300 px-3 py-1 outline-none transition duration-200 ease-in-out hover:border-blue-400 focus:border-blue-600 ${errorMessage ? "border-red-500" : "border-gray-300"}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename();
                  if (e.key === "Escape") setIsRenaming(false);
                }}
                disabled={fetcher.state === "submitting"}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />

              <div className="flex gap-2.5">
                <button
                  onClick={submitRename}
                  disabled={!newName.trim() || fetcher.state === "submitting"}
                  className="rounded-md bg-blue-500 px-3 py-1 font-medium text-white transition duration-200 ease-in-out hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {fetcher.state === "submitting" ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsRenaming(false);
                    setErrorMessage(null);
                  }}
                  className="rounded-md bg-gray-200 px-3 py-1 font-medium transition duration-200 ease-in-out hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h1 className="text-3xl font-bold">{wishlist.name}</h1>
          )}
        </div>

        <MenuDots items={dropdownItems} />
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
