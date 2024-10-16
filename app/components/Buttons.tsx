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
  variant = "primary",
  type = "button",
  disabled = false,
  children,
}: {
  className?: string;
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
    <button type={type} disabled={disabled} className={mergedClassName}>
      {children}
    </button>
  );
};

export const Checkbox = ({
  className,
  parentInput = false,
  selected = false,
  disabled = false,
  onChange,
  label,
}: {
  className?: string;
  parentInput?: boolean;
  selected?: boolean;
  disabled?: boolean;
  label?: string;
  onChange: (checked: boolean) => void;
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!selected);
    }
  };

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div
        role="checkbox"
        aria-checked={selected}
        aria-label={parentInput ? "Select all" : label}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={twMerge(
          "relative flex size-5 items-center justify-center rounded-[6px] border-2 border-black/75 transition-colors",
          selected && "border-blue-700 bg-blue-700",
          !disabled && "hover:border-blue-700",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {selected && (
          <svg
            className="size-3 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </label>
  );
};
