import { Link } from "@remix-run/react";
import IconButton from "./IconButton";
import { PersonIcon, SearchIcon, ShoppingCartIcon } from "./Icons";

export default function Navbar() {
  return (
    <nav className="z-[99] flex w-full">
      <div className="mx-10 flex w-full items-center justify-between">
        <Link to={"/"}>TechVibe</Link>
        {/* Nav links */}
        <div>
          {/* Make nav link component */}
          <Link to={"#"} className="px-4 py-2.5">
            Home
          </Link>{" "}
          <Link to={"#"}>Products</Link>
          <Link to={"#"}>Support</Link>
        </div>
        {/* Search, My Cart, and My Account */}
        <div className="flex items-center gap-3">
          <IconButton
            href="#"
            icon={
              <div className="fill-none stroke-black/75 group-hover:stroke-black">
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
  );
}
