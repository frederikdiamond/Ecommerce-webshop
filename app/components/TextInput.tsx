import { twMerge } from "tailwind-merge";

export const FloatingLabelInput = ({
  type = "text",
  label,
  id,
  name,
  value,
  defaultValue,
  onChange = () => {},
  className,
  required = false,
}: {
  type?: string;
  label: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        name={name}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        required={required}
        className={twMerge(
          "peer block w-full appearance-none rounded-2xl border-2 border-gray-300 border-transparent bg-black/5 px-4 pb-2.5 pt-5 text-gray-900 transition duration-300 ease-in-out hover:bg-black/10 focus:border-blue-600 focus:outline-none focus:ring-0",
          className,
        )}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute start-4 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
};
