import { Form, useActionData, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useTransition } from "react";
import { CustomButton } from "~/components/Buttons";
import { FloatingLabelInput } from "~/components/TextInput";

interface ActionData {
  errors?: {
    wishlistName?: string;
    general?: string;
  };
  success?: boolean;
}

export default function CreateWishlist({
  confirmCreate,
  close,
}: {
  confirmCreate: () => void;
  close: () => void;
}) {
  const fetcher = useFetcher<ActionData | { success: boolean }>();
  const actionData = fetcher.data;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.type === "done") {
      if ("success" in actionData && actionData.success) {
        confirmCreate();
      }
    }
  }, [fetcher.type, actionData, confirmCreate, close]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    fetcher.submit(form);
  };

  return (
    <fetcher.Form
      ref={formRef}
      method="post"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
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
            className="mt-10"
            // className={`mt-1 block w-full rounded-md border ${
            //     actionData?.errors?.wishlistName ? "border-red-500" : "border-gray-300"
            //   } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
            //   aria-invalid={actionData?.errors?.wishlistName ? "true" : undefined}
            //   aria-describedby={actionData?.errors?.wishlistName ? "wishlistName-error" : undefined}
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
          <CustomButton type="submit" disabled={fetcher.state === "submitting"}>
            {fetcher.state === "submitting" ? "Creating..." : "Create"}
          </CustomButton>
          <CustomButton onClick={close} variant="secondary">
            Cancel
          </CustomButton>
        </div>
      </div>
    </fetcher.Form>
  );
}
