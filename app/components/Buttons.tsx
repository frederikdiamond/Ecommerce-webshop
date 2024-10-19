import { Link } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

export const CustomLink = ({
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
  const baseStyles = "px-5 py-3 text-center rounded-xl font-semibold";
  const variantStyles = {
    primary: " bg-gradient-to-b from-[#0EBEFE] to-[#312FAD] text-white",
    secondary:
      "text-black hover:bg-black/10 active:bg-black/20 transition-all duration-200 ease-in-out",
  };

  const scaleEffect =
    variant === "primary"
      ? "transition duration-200 ease-in-out hover:scale-105 active:scale-95"
      : "transition duration-200 ease-in-out active:scale-95";

  const mergedClassName = twMerge(
    baseStyles,
    variantStyles[variant],
    scaleEffect,
    className,
  );

  return (
    <Link to={url} className={mergedClassName}>
      {children}
    </Link>
  );
};

export const CustomButton = ({
  className,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  children,
}: {
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const baseStyles = "px-4 py-2 rounded-md";
  const variantStyles = {
    primary:
      "rounded-xl bg-gradient-to-b from-[#0EBEFE] to-[#312FAD] px-5 py-3 text-center font-semibold text-white transition duration-200 ease-in-out hover:scale-105 active:scale-95",
    secondary:
      "rounded-xl text-center font-semibold text-black px-5 py-3 hover:bg-black/10 active:bg-black/20 transition-all duration-200 ease-in-out active:scale-95",
  };

  const mergedClassName = twMerge(
    baseStyles,
    variantStyles[variant],
    className,
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={mergedClassName}
    >
      {children}
    </button>
  );
};
