import { Link } from "@remix-run/react";

export default function Navbar() {
  return (
    <nav className="z-[99] flex w-full">
        <div className="flex justify-between items-center"><Link to={"#"}>TechVibe</Link>
        {/* Nav links */}
        <div><Link to={"#"}>Home</Link><Link to={"#"}>Products</Link><Link to={"#"}>Support</Link></div>
        {/* Search, My Cart, and My Account */}
        <div></div>
        </div>
    </nav>
  );
}
