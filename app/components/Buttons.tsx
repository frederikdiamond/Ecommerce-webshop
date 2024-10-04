import { Link } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

export const Button = ({
  url,
  className,
  variant = "primary",
  children,
}: {
  url: string;
  className?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) => {
  const baseStyles = "px-4 py-2 rounded-md";
  const variantStyles = {
    primary:
      "rounded-xl bg-gradient-to-b from-[#0EBEFE] to-[#312FAD] px-5 py-3 text-center font-semibold text-white",
    secondary:
      "rounded-xl text-center font-semibold text-black px-5 py-3 hover:bg-black/10 active:bg-black/20 transition-all duration-200 ease-in-out",
  };

  const mergedClassName = twMerge(
    baseStyles,
    variantStyles[variant],
    className,
  );

  const scaleEffect = [
    variant === "primary"
      ? "transition duration-200 ease-in-out hover:scale-105 active:scale-95"
      : "",
    variant === "secondary"
      ? "transition duration-200 ease-in-out active:scale-95"
      : "",
  ];

  return (
    <div className={twMerge(scaleEffect)}>
      <Link to={url} className={mergedClassName}>
        {children}
      </Link>
    </div>
  );
};
