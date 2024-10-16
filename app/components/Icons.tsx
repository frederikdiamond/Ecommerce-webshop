export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 3s-6.186 5.34-9.643 8.232A1.041 1.041 0 0 0 2 12a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1a.98.98 0 0 0-.383-.768C18.184 8.34 12 3 12 3z"
      />
    </svg>
  );
};

export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="48"
        d="M88 152h336M88 256h336M88 360h336"
      />
    </svg>
  );
};

export const SupportIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        fill="currentColor"
        d="M512 896q-66 0-134-16q-34 40-69.5 69.5t-60 43.5t-47.5 21.5t-30 8.5t-11 1q26-57 30-124.5T176 786Q94 723 47 635T0 448q0-91 40.5-174t109-143T313 35.5T512 0t199 35.5T874.5 131t109 143t40.5 174t-40.5 174t-109 143T711 860.5T512 896zm-64-160q0 13 9 22.5t23 9.5h64q13 0 22.5-9.5T576 736v-64q0-14-9.5-23t-22.5-9h-64q-14 0-23 9t-9 23v64zm64-608q-85 0-152 37.5T268 262l116 58q0-27 37.5-45.5T512 256t90.5 18.5t37.5 45t-37.5 45.5t-90.5 19q-27 0-45.5 18.5T448 448v96q0 13 9 22.5t23 9.5h64q13 0 22.5-9.5T576 544v-39q83-16 137.5-67.5T768 320q0-80-75-136t-181-56z"
      />
    </svg>
  );
};

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g>
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20l-3-3" />
      </g>
    </svg>
  );
};

export const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
      <path
        fillRule="evenodd"
        d="M.75 1.5h1.396l.379 1.44a.768.768 0 0 0 .01.034l.968 4.845a.757.757 0 0 0 .012.078l.42 2.1V10a1.25 1.25 0 0 0 1.225 1h6.09a.75.75 0 0 0 0-1.5H5.365l-.25-1.25h6.997c.035 0 .135.003.227-.012a1.01 1.01 0 0 0 .756-.589c.054-.124.081-.281.09-.333l.003-.014l.791-3.862l.002-.01a1.001 1.001 0 0 0-.98-1.18H3.894L3.56.975A1.25 1.25 0 0 0 2.34 0H.75a.75.75 0 1 0 0 1.5m10.88 11.3a1.149 1.149 0 1 0-2.298 0a1.149 1.149 0 0 0 2.297 0Zm-6.15-1.148a1.149 1.149 0 1 1 0 2.297a1.149 1.149 0 0 1 0-2.297"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const PersonIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1664 1664">
      <path
        fill="currentColor"
        d="M832 0Q673 0 560.5 112.5T448 384t112.5 271.5T832 768t271.5-112.5T1216 384t-112.5-271.5T832 0zm0 896q112 0 227 22t224 69.5t193.5 114t136 162.5t51.5 208q0 75-57 133.5t-135 58.5H192q-78 0-135-58.5T0 1472q0-112 51.5-208t136-162.5t193.5-114T605 918t227-22z"
      />
    </svg>
  );
};

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="m47.6 300.4l180.7 168.7c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9l180.7-168.7c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141c-45.6-7.6-92 7.3-124.6 39.9l-12 12l-12-12c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
    </svg>
  );
};

export const ArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path d="m5.157 13.069l4.611-4.685a.546.546 0 0 0 0-.768L5.158 2.93a.552.552 0 0 1 0-.771a.53.53 0 0 1 .759 0l4.61 4.684a1.65 1.65 0 0 1 0 2.312l-4.61 4.684a.53.53 0 0 1-.76 0a.552.552 0 0 1 0-.771" />
    </svg>
  );
};

export const DropdownIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 616 614" {...props}>
      <path
        fill="currentColor"
        d="m602.442 200l-253 317c-24 29-61 29-84 0l-253-317c-24-30-12-53 25-53h540c38 0 49 23 25 53z"
      />
    </svg>
  );
};

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="m289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34Z" />
    </svg>
  );
};

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 36 36"
      {...props}
    >
      <path d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379z" />
    </svg>
  );
};

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
      <g>
        <path d="M5 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2H5Z" />
        <path d="M9 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0V5Z" />
      </g>
    </svg>
  );
};

export const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" {...props}>
      <path d="M34 18a3 3 0 0 1-3 3H5a3 3 0 1 1 0-6h26a3 3 0 0 1 3 3z" />
    </svg>
  );
};

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  ...props
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z" />
    </svg>
  );
};
