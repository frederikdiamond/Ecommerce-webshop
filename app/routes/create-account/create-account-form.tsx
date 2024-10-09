import { Form } from "@remix-run/react";
import { ActionData } from "./route";
import { FloatingLabelInput } from "~/components/TextInput";
import { CustomButton } from "~/components/Buttons";

export function CreateAccountForm({
  error,
  fields,
}: {
  error: ActionData["error"];
  fields: ActionData["fields"];
}) {
  return (
    <Form method="post" className="flex w-full flex-col gap-4">
      <FloatingLabelInput
        label="First Name"
        name="firstName"
        id="firstName"
        defaultValue={fields?.firstName}
        className={`${error?.fieldErrors?.firstName ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Last Name"
        name="lastName"
        id="lastName"
        defaultValue={fields?.lastName}
        className={`${error?.fieldErrors?.lastName ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Username"
        name="username"
        id="username"
        defaultValue={fields?.username}
        className={`${error?.fieldErrors?.username ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Email"
        name="email"
        id="email"
        defaultValue={fields?.email}
        className={`${error?.fieldErrors?.email ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Password"
        name="password"
        id="password"
        type="password"
        defaultValue={fields?.password}
        className={`${error?.fieldErrors?.password ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Confirm Password"
        name="confirmPassword"
        id="confirmPassword"
        type="password"
        defaultValue={fields?.confirmPassword}
        className={`${error?.fieldErrors?.confirmPassword ? "border-red-500" : ""}`}
        required
      />

      <div className="flex flex-col gap-2.5">
        {error?.formError && <p className="text-red-500">{error?.formError}</p>}

        {error?.fieldErrors?.firstName && (
          <p className="text-red-500">{error?.fieldErrors?.firstName}</p>
        )}

        {error?.fieldErrors?.lastName && (
          <p className="text-red-500">{error?.fieldErrors?.lastName}</p>
        )}

        {error?.fieldErrors?.username && (
          <p className="text-red-500">{error?.fieldErrors?.username}</p>
        )}

        {error?.fieldErrors?.email && (
          <p className="text-red-500">{error?.fieldErrors?.email}</p>
        )}

        {error?.fieldErrors?.password && (
          <p className="text-red-500">{error?.fieldErrors?.password}</p>
        )}

        {error?.fieldErrors?.confirmPassword && (
          <p className="text-red-500">{error?.fieldErrors?.confirmPassword}</p>
        )}
      </div>

      <CustomButton type="submit" className="mx-auto w-[170px]">
        Create Account
      </CustomButton>
    </Form>
  );
}
