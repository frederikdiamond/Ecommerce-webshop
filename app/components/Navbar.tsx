import { Link, useLocation } from "@remix-run/react";
import IconButton from "./IconButton";
import { PersonIcon, SearchIcon, ShoppingCartIcon } from "./Icons";
import NavLink from "./NavLink";
import { useEffect, useRef, useState } from "react";

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

export default function Navbar() {
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [lastActiveCategory, setLastActiveCategory] = useState(null);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const location = useLocation();
  // const sidemenuRef = useRef(null);
  const productMenuRef = useRef(null);

  const handleCategoryClick = (categoryId) => {
    setOpenCategory(categoryId === openCategory ? null : categoryId);
    setLastActiveCategory(categoryId);
  };

  useEffect(() => {
    const handleMouseEnter = () => setIsHoveringMenu(true);
    const handleMouseLeave = () => {
      setIsHoveringMenu(false);
      setHoveredCategory(null);
    };

    const productMenu = productMenuRef.current;
    if (productMenu) {
      productMenu.addEventListener("mouseenter", handleMouseEnter);
      productMenu.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (productMenu) {
        productMenu.removeEventListener("mouseenter", handleMouseEnter);
        productMenu.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    if (hoveredCategory) {
      setLastActiveCategory(hoveredCategory);
    }
  }, [hoveredCategory]);

  const isSidemenuOpen = hoveredCategory || openCategory || lastActiveCategory;
  const activeCategoryId =
    hoveredCategory || openCategory || lastActiveCategory;

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[95] flex w-full bg-white">
        <div className="mx-10 my-1.5 flex w-full items-center justify-between">
          <Link to={"/"}>TechVibe</Link>
          {/* Nav links and product menu toggle */}
          <div className="flex gap-2">
            <NavLink href="/">Home</NavLink>
            <button
              onClick={() => setIsProductMenuOpen(true)}
              className="flex gap-2 rounded-md px-4 py-2 text-black/50 transition duration-200 ease-in-out hover:bg-black/10 hover:text-black active:bg-black/20"
            >
              Products
            </button>
            <NavLink href="/support">Support</NavLink>
          </div>
          {/* Search, My Cart, and My Account */}
          <div className="flex items-center gap-3">
            <IconButton
              href="#"
              icon={
                <div className="fill-none stroke-black/75 stroke-[2.5px] group-hover:stroke-black">
                  <SearchIcon />
                </div>
              }
            />

            <IconButton
              href="#"
              icon={
                <div className="fill-black/75 group-hover:fill-black">
                  <ShoppingCartIcon />
                </div>
              }
            />

            <button className="flex items-center gap-3.5 rounded-xl p-2.5 opacity-75 transition-all duration-200 ease-in-out hover:bg-black/10 hover:opacity-100 active:bg-black/20">
              <div className="size-5">
                <PersonIcon />
              </div>
              <span>My Account</span>
              <svg
                className="size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 616 614"
              >
                <path
                  fill="currentColor"
                  d="m602.442 200l-253 317c-24 29-61 29-84 0l-253-317c-24-30-12-53 25-53h540c38 0 49 23 25 53z"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Product menu */}
      {isProductMenuOpen && (
        <div className="fixed z-[99] h-full w-full bg-black/25 backdrop-blur-xl">
          <div
            ref={productMenuRef}
            className="fixed bottom-0 left-0 top-0 flex"
          >
            <div className="z-[100] w-64 bg-white pl-10 pt-10">
              <button
                onClick={() => setIsProductMenuOpen(false)}
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
                <h2 className="mb-2.5 font-bold opacity-50">Products</h2>
                <Link to="/products" className="py-2.5 text-xl">
                  All Products
                </Link>
                {productCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={category.link}
                    className={`flex items-center justify-between py-2.5 pr-3 text-xl transition-colors duration-200 ${
                      location.pathname === category.link ||
                      hoveredCategory === category.id ||
                      openCategory === category.id ||
                      lastActiveCategory === category.id
                        ? "text-black"
                        : "text-black/50 hover:text-black"
                    }`}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                    <svg
                      className={`relative size-8 rotate-180 transition-all duration-200 ${
                        (hoveredCategory === category.id ||
                          openCategory === category.id ||
                          lastActiveCategory === category.id) &&
                        isHoveringMenu
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
                ))}
              </div>
            </div>

            <div
              // ref={sidemenuRef}
              className={`w-64 flex-shrink-0 bg-gray-100 p-10 transition-all duration-300 ease-in-out ${
                isSidemenuOpen
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none -translate-x-20 opacity-0"
              }`}
            >
              {activeCategoryId && (
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
