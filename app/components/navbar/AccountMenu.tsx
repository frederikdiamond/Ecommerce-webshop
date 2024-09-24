/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link } from "@remix-run/react";

const AccountMenuLink = ({
  to,
  text,
  first,
  last,
}: {
  to: string;
  text: string;
  first?: boolean;
  last?: boolean;
}) => {
  return (
    <Link
      to={to}
      className={`w-full py-2.5 pl-4 font-medium opacity-50 transition duration-200 hover:bg-black/5 hover:opacity-100 active:bg-black/15 ${first ? "rounded-t-[11px]" : null} ${last ? "rounded-b-[11px]" : null}`}
    >
      {text}
    </Link>
  );
};

export default function AccountMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed right-5 top-16 z-40 flex w-52 flex-col rounded-xl border border-black/10 transition duration-200 hover:border-black/20"
    >
      <AccountMenuLink to="my-orders" text="Orders" first={true} />
      <AccountMenuLink to="#" text="Wishlist" />
      <AccountMenuLink to="#" text="Settings" />
      <AccountMenuLink to="#" text="Log Out" last={true} />
    </div>
  );
}
