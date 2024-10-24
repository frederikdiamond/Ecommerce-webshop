import { useState, useRef, useEffect } from "react";
import { MenuDotsIcon } from "~/components/Icons";

type DropdownItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
};

type DropdownMenuProps = {
  items: DropdownItem[];
};

export const MenuDots = ({ items }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        onClick={handleClick}
        className="rounded-full p-1.5 opacity-50 transition duration-200 ease-in-out hover:bg-black/5 hover:opacity-100 active:bg-black/10"
      >
        <MenuDotsIcon className="size-6" />
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
              className="group flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-black/50 transition duration-200 ease-in-out hover:bg-black/5 hover:text-black active:bg-black/10"
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
