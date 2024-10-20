import { MenuDotsIcon } from "~/components/Icons";

export default function MenuDots() {
  return (
    <div>
      <button className="rounded-full p-2 opacity-50 transition duration-200 ease-in-out hover:bg-black/5 hover:opacity-100 active:bg-black/10">
        <MenuDotsIcon className="size-7" />
      </button>
    </div>
  );
}
