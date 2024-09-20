import { useState } from "react";
import { Link } from "@remix-run/react";
import IconButton from "./IconButton";
import {
  HomeIcon,
  MenuIcon,
  PersonIcon,
  SearchIcon,
  ShoppingCartIcon,
  SupportIcon,
} from "./Icons";
import NavLink from "./NavLink";
import ProductMenu from "./ProductMenu";

export default function Navbar() {
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[95] flex w-full bg-white">
        <div className="mx-10 my-1.5 flex w-full items-center justify-between">
          <Link to={"/"}>TechVibe</Link>
          {/* Nav links and product menu toggle */}
          <div className="flex gap-2">
            <NavLink href="/">
              <div className="size-6">
                <HomeIcon />
              </div>
              Home
            </NavLink>
            <button
              onClick={() => setIsProductMenuOpen(true)}
              className="flex items-center gap-1.5 rounded-md px-4 py-2 text-black/50 transition duration-200 ease-in-out hover:bg-black/10 hover:text-black active:bg-black/20"
            >
              <div className="size-6">
                <MenuIcon />
              </div>
              Products
            </button>
            <NavLink href="/support">
              <div className="size-6">
                <SupportIcon />
              </div>
              Support
            </NavLink>
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

      <ProductMenu
        isProductMenuOpen={isProductMenuOpen}
        setIsProductMenuOpen={setIsProductMenuOpen}
      />
    </>
  );
}
