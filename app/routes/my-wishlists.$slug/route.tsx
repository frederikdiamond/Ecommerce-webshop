import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { ArrowIcom } from "~/components/Icons";

interface WishlistItem {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
}

interface Wishlist {
  id: string;
  name: string;
  slug: string;
  items: WishlistItem[];
}

interface LoaderData {
  wishlist: Wishlist;
}

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;

  // Testing with mock data
  const wishlist: Wishlist = {
    id: "1",
    name:
      slug?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "Unknown Wishlist",
    slug: slug || "",
    items: [
      {
        id: "1",
        imageUrl: "/placeholder.jpg",
        name: "Item 1",
        description: "Description 1",
        price: 19.99,
      },
      {
        id: "2",
        imageUrl: "/placeholder.jpg",
        name: "Item 2",
        description: "Description 2",
        price: 29.99,
      },
    ],
  };
  return json<LoaderData>({ wishlist });
};

export default function WishlistDetails() {
  const { wishlist } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto mt-32 max-w-4xl">
      <div className="mb-6 flex items-center gap-2">
        <Link
          to={"/my-wishlists"}
          className="group rounded-full p-1 transition duration-200 ease-in-out hover:bg-black/5 active:bg-black/10"
        >
          <ArrowIcom className="size-7 rotate-180 stroke-black stroke-[0.5px] opacity-50 transition duration-200 ease-in-out group-hover:opacity-100" />
        </Link>
        <h1 className="text-3xl font-bold">{wishlist.name}</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {wishlist.items.map((item) => (
          <div key={item.id} className="rounded-lg border p-4">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="mb-4 h-48 w-full rounded-md object-cover"
            />
            <h2 className="mb-2 text-xl font-semibold">{item.name}</h2>
            <p className="mb-2 text-gray-600">{item.description}</p>
            <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
