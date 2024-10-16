import { defer, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { loader as bestSellingProductsLoader } from "./api.best-selling-products.server";
import { loader as newestProductsLoader } from "./api.newest-products.server";
import BestSellingProducts from "~/components/product-carousels/BestSellingProducts";
import NewestProducts from "~/components/product-carousels/NewestProducts";
import { Suspense } from "react";
import { Await, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "TechVibe" },
    { name: "description", content: "Portfolio project" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const bestSellingPromise = bestSellingProductsLoader().then((res) =>
    res.json(),
  );
  const newestProductsPromise = newestProductsLoader({ request }).then((res) =>
    res.json(),
  );
  // const bestSellingPromise = bestSellingProductsLoader();
  // const newestProductsPromise = newestProductsLoader({ request });

  return defer({
    bestSelling: bestSellingPromise,
    newest: newestProductsPromise,
  });
};

export default function Index() {
  const { bestSelling, newest } = useLoaderData<typeof loader>();

  return (
    <main className="mt-16">
      <div className="mx-auto flex w-[950px] flex-col gap-10">
        <Suspense fallback={<div>Loading best selling products...</div>}>
          <Await resolve={bestSelling}>
            {(resolvedBestSelling) => {
              console.log("Resolved bestSelling:", resolvedBestSelling);

              if (
                !resolvedBestSelling ||
                !resolvedBestSelling.bestSellingProducts
              ) {
                console.error("No best selling products found");
                return <div>No best selling products available</div>;
              }

              return (
                <BestSellingProducts
                  products={resolvedBestSelling.bestSellingProducts}
                />
              );
            }}
          </Await>
        </Suspense>

        <Suspense fallback={<div>Loading newest products...</div>}>
          <Await resolve={newest}>
            {(resolvedNewest) => {
              console.log("Resolved newest:", resolvedNewest);

              if (
                !resolvedNewest?.newestProducts ||
                resolvedNewest.newestProducts.length === 0
              ) {
                console.error("No newest products found");
                return <div>No newest products available</div>;
              }

              return (
                <NewestProducts products={resolvedNewest.newestProducts} />
              );
            }}
          </Await>
        </Suspense>
      </div>
    </main>
  );
}
