import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";

interface WishlistItem {
  id: string;
  imageUrl: string;
  name: string;
}

interface Wishlist {
  id: string;
  name: string;
  slug: string;
  items: WishlistItem[];
}

interface LoaderData {
  wishlists: Wishlist[];
}

export const loader: LoaderFunction = async () => {
  // Testing with mock data
  const wishlists: Wishlist[] = [
    {
      id: "1",
      name: "Birthday Wishlist",
      slug: "birthday-wishlist",
      items: [
        {
          id: "1",
          imageUrl:
            "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",
          name: "Item 1",
        },
        {
          id: "1",
          imageUrl:
            "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",
          name: "Item 1",
        },
      ],
    },
    {
      id: "2",
      name: "Christmas Wishlist",
      slug: "christmas-wishlist",
      items: [
        {
          id: "2",
          imageUrl:
            "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-gallery2-202310_GEO_DK?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=1698156926558",
          name: "Item 2",
        },
      ],
    },
  ];
  return json<LoaderData>({ wishlists });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "createWishlist") {
    return redirect("/my-wishlists");
  }
};

export default function Wishlist() {
  const { wishlists } = useLoaderData<LoaderData>();

  return (
    <div className="mt-32 flex flex-col items-center">
      <div>
        <div className="flex w-[950px] items-center justify-between">
          <div className="flex items-start gap-3">
            <h1 className="text-4xl font-bold tracking-wide">MY WISHLISTS</h1>
            <p className="text-lg font-bold">[{wishlists.length}]</p>
          </div>
          <Form method="post">
            <button
              type="submit"
              name="intent"
              value="createWishlist"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Create New
            </button>
          </Form>
        </div>

        <div className="mt-5 flex flex-col">
          {wishlists.map((wishlist, index) => (
            <div key={wishlist.id}>
              <Link
                to={`/my-wishlists/${wishlist.slug}`}
                className="group block py-4"
              >
                <h2 className="text-xl font-semibold group-hover:text-blue-500">
                  {wishlist.name}
                </h2>
                <div className="mt-2 flex gap-2.5">
                  {wishlist.items.slice(0, 4).map((item) => (
                    <img
                      key={item.id}
                      src={item.imageUrl}
                      alt={item.name}
                      className="size-28 rounded-xl object-cover"
                    />
                  ))}
                </div>
              </Link>
              {index < wishlists.length - 1 && (
                <div className="h-px w-full bg-black/10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
