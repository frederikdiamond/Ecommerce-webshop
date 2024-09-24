import type { MetaFunction } from "@remix-run/node";
import ProductCard from "~/components/ProductCard";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Portfolio project" },
  ];
};

export default function Index() {
  return (
    <main className="mt-16">
      <div className="mx-auto flex w-[950px] flex-col gap-10">
        {/* Replace with carousel component */}
        <div>
          <h2 className="mb-3 text-2xl font-medium">Best Selling</h2>
          <div className="flex gap-5">
            <ProductCard
              productName="iPhone 16 Pro Max"
              productDescription="512GB"
              productPrice={1099}
              productImage="https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg"
            />
            <ProductCard
              productName="iPhone 16 Pro Max"
              productDescription="512GB"
              productPrice={1099}
              productImage="https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg"
            />
          </div>
        </div>
        <h2>Newest Products</h2>
      </div>

      {/* <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-16">
          <header className="flex flex-col items-center gap-9">
            <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
              Welcome to <span className="sr-only">Remix</span>
            </h1>
            <div className="h-[144px] w-[434px]">
              <img
                src="/logo-light.png"
                alt="Remix"
                className="block w-full dark:hidden"
              />
              <img
                src="/logo-dark.png"
                alt="Remix"
                className="hidden w-full dark:block"
              />
            </div>
          </header>
          <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
            <p className="leading-6 text-gray-700 dark:text-gray-200">
              What&apos;s next?
            </p>
            <ul>
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <a
                    className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div> */}
    </main>
  );
}
