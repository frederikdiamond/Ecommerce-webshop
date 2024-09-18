import { Link } from "@remix-run/react";

export default function IconButton({
  href,
  size = 25,
  icon,
}: {
  href: string;
  size?: number;
  icon: JSX.Element;
}) {
  return (
    <Link
      to={href}
      className={`group flex items-center justify-center rounded-full p-2.5 transition-colors duration-200 ease-in-out hover:bg-black/10 active:bg-black/20`}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {icon}
      </div>
    </Link>
  );
}
