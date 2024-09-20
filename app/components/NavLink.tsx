import { Link, useLocation } from "@remix-run/react";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const location = useLocation();

  return (
    <Link
      to={href}
      className={`flex items-center gap-1.5 rounded-md px-4 py-2 transition duration-200 ease-in-out hover:bg-black/10 active:bg-black/20 ${location.pathname === href ? "font-semibold text-black" : "font-normal text-black/50 hover:text-black"}`}
    >
      {children}
    </Link>
  );
}
