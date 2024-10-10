import { Form } from "@remix-run/react";
import { ActionDataCreateAccount } from "./route";
import { FloatingLabelInput } from "~/components/TextInput";
import { CustomButton } from "~/components/Buttons";
import { useEffect, useState } from "react";

export function CreateAccountForm({
  error,
  fields,
}: {
  error: ActionDataCreateAccount["error"];
  fields: ActionDataCreateAccount["fields"];
}) {
  const [formData, setFormData] = useState({
    firstName: fields?.firstName || "",
    lastName: fields?.lastName || "",
    username: fields?.username || "",
    email: fields?.email || "",
    password: fields?.password || "",
    confirmPassword: fields?.confirmPassword || "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== "",
    );
    setIsFormValid(allFieldsFilled);
  }, [formData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <Form method="post" className="flex w-full flex-col gap-4">
      <FloatingLabelInput
        label="First Name"
        name="firstName"
        id="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        className={`${error?.fieldErrors?.firstName ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Last Name"
        name="lastName"
        id="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        className={`${error?.fieldErrors?.lastName ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Username"
        name="username"
        id="username"
        value={formData.username}
        onChange={handleInputChange}
        className={`${error?.fieldErrors?.username ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Email"
        name="email"
        id="email"
        value={formData.email}
        onChange={handleInputChange}
        className={`${error?.fieldErrors?.email ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Password"
        name="password"
        id="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        className={`${error?.fieldErrors?.password ? "border-red-500" : ""}`}
        required
      />

      <FloatingLabelInput
        label="Confirm Password"
        name="confirmPassword"
        id="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
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

      <CustomButton
        type="submit"
        className={`mx-auto w-[170px] ${!isFormValid || error ? "cursor-not-allowed opacity-50" : ""}`}
      >
        Create Account
      </CustomButton>
    </Form>
  );
}
