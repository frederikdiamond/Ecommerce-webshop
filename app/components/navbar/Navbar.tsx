import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import IconButton from "../IconButton";
import {
  HomeIcon,
  MenuIcon,
  PersonIcon,
  SearchIcon,
  ShoppingCartIcon,
  SupportIcon,
} from "../Icons";
import NavLink from "./NavLink";
import ProductMenu from "../ProductMenu";
import AccountMenu from "./AccountMenu";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { Button } from "../Buttons";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
}

export default function Navbar() {
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const data = useLoaderData<typeof loader>();

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  const closeAccountMenu = () => {
    setShowAccountMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        closeAccountMenu();
      }
    };

    if (showAccountMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountMenu]);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[95] flex w-full bg-white">
        <div className="mx-10 my-1.5 flex w-full items-center justify-between">
          <Link to={"/"} className="text-lg leading-relaxed">
            Tech<span className="font-semibold">Vibe</span>
          </Link>
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
                <div className="fill-none stroke-black/50 stroke-[2.5px] group-hover:stroke-black">
                  <SearchIcon />
                </div>
              }
            />

            <IconButton
              href="shopping-cart"
              icon={
                <div className="fill-black/50 group-hover:fill-black">
                  <ShoppingCartIcon />
                </div>
              }
            />

            {data?.user ? (
              <div ref={accountMenuRef}>
                <button
                  onClick={toggleAccountMenu}
                  className="flex items-center gap-3.5 rounded-xl p-2.5 opacity-50 transition-all duration-200 ease-in-out hover:bg-black/10 hover:opacity-100 active:bg-black/20"
                >
                  <div className="size-5">
                    <PersonIcon />
                  </div>
                  <span>My Account</span>
                  <svg
                    className={`${showAccountMenu ? "rotate-180" : "rotate-0"} size-3.5 transition-all duration-300 ease-in-out`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 616 614"
                  >
                    <path
                      fill="currentColor"
                      d="m602.442 200l-253 317c-24 29-61 29-84 0l-253-317c-24-30-12-53 25-53h540c38 0 49 23 25 53z"
                    />
                  </svg>
                </button>
                {showAccountMenu && <AccountMenu onClose={closeAccountMenu} />}
              </div>
            ) : (
              <div className="flex gap-2.5">
                <Button url="/login" variant="secondary">
                  Login
                </Button>
                <Button url="/create-account">Create Account</Button>
              </div>
            )}
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
