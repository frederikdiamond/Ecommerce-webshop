import { Link } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

interface ProductMenuProps {
  isProductMenuOpen: boolean;
  setIsProductMenuOpen: (value: boolean) => void;
}

const productCategories = [
  { id: 1, name: "Phones", link: "/products/phones" },
  { id: 2, name: "Computers", link: "/products/computers" },
  { id: 3, name: "Smart Watches", link: "/products/smart-watches" },
  { id: 4, name: "Accessories", link: "/products/accessories" },
];

const categoryOptions = {
  1: ["iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"],
  2: ["MacBook Air", "MacBook Pro", "Mac Studio", "Mac Mini"],
  3: ["Apple Watch Series 10", "Apple Watch Ultra 2"],
  4: ["AirPods", "Studio Display", "Chargers"],
};

export default function ProductMenu({
  isProductMenuOpen,
  setIsProductMenuOpen,
}: ProductMenuProps) {
  const [hoveredProductCategory, setHoveredProductCategory] = useState<
    number | null
  >(null);
  const [lastActiveCategory, setLastActiveCategory] = useState<number | null>(
    null,
  );
  const [isSidemenuOpen, setIsSidemenuOpen] = useState(false);
  const productCategoryMenuRef = useRef<HTMLDivElement>(null);
  const productSideMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsSidemenuOpen(true);
    };

    const handleMouseLeave = () => {
      setIsSidemenuOpen(false);
      setHoveredProductCategory(null);
      setLastActiveCategory(null);
    };

    const productSidemenu = productSideMenuRef.current;
    if (productSidemenu) {
      productSidemenu.addEventListener("mouseenter", handleMouseEnter);
      productSidemenu.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (productSidemenu) {
        productSidemenu.removeEventListener("mouseenter", handleMouseEnter);
        productSidemenu.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isSidemenuOpen, hoveredProductCategory]);

  const activeCategoryId = hoveredProductCategory || lastActiveCategory;

  return (
    <>
      {/* Product menu */}
      {isProductMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-[99] h-full w-full bg-black/25 backdrop-blur-xl">
          <div className="fixed bottom-0 left-0 top-0 flex">
            <div
              //   ref={productCategoryMenuRef}
              className="z-[100] w-64 bg-white pl-10 pt-10"
            >
              <button
                onClick={() => {
                  setIsProductMenuOpen(false);
                }}
                className="rounded-full p-2.5 opacity-50 hover:bg-black/5 hover:opacity-100"
              >
                <svg
                  className="size-10"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M4.28 3.22a.75.75 0 0 0-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06L8 9.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L9.06 8l3.72-3.72a.75.75 0 0 0-1.06-1.06L8 6.94L4.28 3.22Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="mt-10 flex flex-col">
                <h2 className="mb-2.5 font-bold opacity-50">Product Menu</h2>
                <Link to="/products" className="py-2.5 text-xl">
                  All Products
                </Link>
                {productCategories.map((category) => (
                  <div key={category.id} ref={productCategoryMenuRef}>
                    <Link
                      to={category.link}
                      className={`flex items-center justify-between py-2.5 pr-3 text-xl transition-colors duration-200 ${
                        lastActiveCategory === category.id ||
                        hoveredProductCategory === category.id
                          ? "text-black"
                          : "text-black/50 hover:text-black"
                      }`}
                      onMouseEnter={() => {
                        setIsSidemenuOpen(true);
                        setHoveredProductCategory(category.id);
                        setLastActiveCategory(category.id);
                      }}
                      onMouseLeave={() => {
                        setIsSidemenuOpen(false);
                        setHoveredProductCategory(null);
                      }}
                      // onClick={() => handleProductCategoryClick(category.id)}
                    >
                      {category.name}
                      <svg
                        className={`relative size-8 rotate-180 transition-all duration-200 ${
                          hoveredProductCategory === category.id ||
                          lastActiveCategory === category.id
                            ? "left-0 opacity-100"
                            : "-left-2 opacity-0"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="1.5"
                        >
                          <path strokeMiterlimit="10" d="M4 12h16" />
                          <path
                            strokeLinejoin="round"
                            d="M11.033 4.34L4.46 10.911a1.53 1.53 0 0 0 0 2.176l6.573 6.573"
                          />
                        </g>
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={productSideMenuRef}
              className={`w-64 flex-shrink-0 bg-gray-100 p-10 transition-all duration-300 ease-in-out ${
                isSidemenuOpen
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none -translate-x-20 opacity-0"
              }`}
            >
              {activeCategoryId !== null && (
                <>
                  <h3 className="mb-4 text-2xl font-bold">
                    {
                      productCategories.find((c) => c.id === activeCategoryId)
                        ?.name
                    }
                  </h3>
                  <div className="flex flex-col">
                    {categoryOptions[activeCategoryId]?.map((option, index) => (
                      <Link
                        key={index}
                        to={`/products/${activeCategoryId}/${index + 1}`}
                        className="py-2.5 transition-all duration-200"
                      >
                        <h4 className="text-lg">{option}</h4>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
