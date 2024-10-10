import { Form } from "@remix-run/react";
import { CustomButton } from "~/components/Buttons";
import { FloatingLabelInput } from "~/components/TextInput";
import { useEffect, useState } from "react";

export default function LoginForm({
  error,
  //   fields,
}: {
  error?: {
    formError?: string[];
    fieldErrors?: {
      login?: string[];
      password?: string[];
    };
  };
}) {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
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

  const renderErrorMessage = (errorMessages?: string[] | undefined) => {
    if (!errorMessages || errorMessages.length === 0) return null;
    return errorMessages.map((message, index) => (
      <p key={index} className="text-sm text-red-500">
        {message}
      </p>
    ));
  };

  return (
    <Form method="post" className="flex w-96 flex-col items-center gap-5">
      <FloatingLabelInput
        label="Username or Email"
        name="login"
        id="login"
        value={formData.login}
        onChange={handleInputChange}
        className={`${error?.fieldErrors?.login && error.fieldErrors.login.length > 0 ? "border-red-500" : ""}`}
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

      {/* {error?.formError && (
        <p className="text-sm text-red-500">{error.formError}</p>
      )}

      {error?.fieldErrors?.login && (
        <p className="text-sm text-red-500">{error.fieldErrors.login}</p>
      )}

      {error?.fieldErrors?.password && (
        <p className="text-sm text-red-500">{error.fieldErrors.password}</p>
      )} */}

      {renderErrorMessage(error?.fieldErrors?.login)}

      {renderErrorMessage(error?.fieldErrors?.password)}

      {renderErrorMessage(error?.formError)}

      <CustomButton
        type="submit"
        disabled={!isFormValid}
        className={`mx-auto w-[170px] ${!isFormValid || error ? "cursor-not-allowed opacity-50" : ""}`}
      >
        Login
      </CustomButton>
    </Form>
  );
}
