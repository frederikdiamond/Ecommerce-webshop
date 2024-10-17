import { twMerge } from "tailwind-merge";

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
