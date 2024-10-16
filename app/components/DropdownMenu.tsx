import { useState } from "react";
import { DropdownIcon } from "./Icons";

type DropdownItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
};

type DropdownMenuProps = {
  label: string;
  items: DropdownItem[];
};

export const DropdownMenu = ({ label, items }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`group relative flex items-center justify-between gap-2.5 rounded border border-black/10 bg-black/5 px-2.5 py-2 transition-all duration-200 ease-in-out hover:border-black/20`}
      >
        <span
          className={`text-sm font-semibold transition duration-200 ease-in-out ${isOpen ? "text-black" : "text-black/50 group-hover:text-black"}`}
        >
          {label}
        </span>
        <DropdownIcon
          className={`size-3 transition duration-200 ease-in-out ${isOpen ? "rotate-180 text-black" : "rotate-0 text-black/50 group-hover:text-black"}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-3 flex min-w-[150px] flex-col items-start rounded border border-black/10 bg-white shadow-md transition duration-200 ease-in-out hover:border-black/20 hover:shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="group flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-black/50 transition ease-in-out hover:bg-black/5 hover:text-black"
            >
              {item.icon && (
                <span className="opacity-50 transition duration-200 ease-in-out group-hover:opacity-100">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
