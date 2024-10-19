/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { CustomButton } from "~/components/Buttons";
import { FloatingLabelInput } from "~/components/TextInput";

interface ActionData {
  errors?: {
    wishlistName?: string;
    general?: string;
  };
  success?: boolean;
}

export default function CreateWishlist({ close }: { close: () => void }) {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);

  useEffect(() => {
    setIsInputValid(inputValue.trim().length > 0 && !actionData?.errors);
  }, [inputValue, actionData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Form method="post" className="space-y-4">
      <input type="hidden" name="intent" value="createWishlist" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-[950px] max-w-md flex-col items-center rounded-2xl bg-white p-5 shadow-lg"
      >
        <h1 className="text-center text-2xl font-semibold">
          Create New Wishlist
        </h1>
        <div className="w-full">
          <FloatingLabelInput
            label="Wishlist name"
            id="wishlistName"
            name="wishlistName"
            value={inputValue}
            onChange={handleInputChange}
            className={`mt-10 ${
              actionData?.errors?.wishlistName ? "border-red-500" : ""
            }`}
            required
          />

          {actionData?.errors?.wishlistName && (
            <p className="mt-2 text-sm text-red-600" id="wishlistName-error">
              {actionData.errors.wishlistName}
            </p>
          )}
        </div>

        {actionData?.errors?.general && (
          <p className="text-sm text-red-600">{actionData.errors.general}</p>
        )}

        <div className="mt-7 flex gap-4">
          <CustomButton
            type="submit"
            disabled={isSubmitting || !isInputValid}
            className={`${!isInputValid ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </CustomButton>
          <CustomButton onClick={close} variant="secondary">
            Cancel
          </CustomButton>
        </div>
      </div>
    </Form>
  );
}
