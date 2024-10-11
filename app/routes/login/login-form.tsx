import { Form } from "@remix-run/react";
import { CustomButton } from "~/components/Buttons";
import { FloatingLabelInput } from "~/components/TextInput";
import { useEffect, useMemo, useState } from "react";

export default function LoginForm({
  error,
  fields,
}: {
  error?: {
    formError?: string[];
    fieldErrors?: {
      login?: string[];
      password?: string[];
    };
  };
  fields?: {
    login: string;
    password: string;
  };
}) {
  const [formData, setFormData] = useState({
    login: fields?.login || "",
    password: fields?.password || "",
  });

  const [hasEdited, setHasEdited] = useState(false);

  const isFormValid = useMemo(() => {
    return Object.values(formData).every((value) => value.trim() !== "");
  }, [formData]);

  const isButtonDisabled = useMemo(() => {
    return !isFormValid || (!!error && !hasEdited);
  }, [isFormValid, error, hasEdited]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasEdited(true);
  };

  useEffect(() => {
    if (error) {
      setHasEdited(false);
    }
  }, [error]);

  const renderErrorMessage = (errorMessages?: string[] | undefined) => {
    if (!errorMessages || errorMessages.length === 0) return null;
    return errorMessages.map((message, index) => (
      <p key={index} className="text-sm text-red-500">
        {message}
      </p>
    ));
  };

  console.log("Error state:", error);
  console.log("Error state:", error?.fieldErrors?.password);

  return (
    <Form method="post" className="flex w-96 flex-col items-center gap-5">
      <FloatingLabelInput
        label="Username or Email"
        name="login"
        id="login"
        value={formData.login}
        onChange={handleInputChange}
        className={`${error?.fieldErrors?.login ? "border-red-500" : ""}`}
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

      {renderErrorMessage(error?.fieldErrors?.login)}

      {renderErrorMessage(error?.fieldErrors?.password)}

      {renderErrorMessage(error?.formError)}

      <CustomButton
        type="submit"
        disabled={isButtonDisabled}
        className={`mx-auto w-[170px] ${isButtonDisabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        Login
      </CustomButton>
    </Form>
  );
}
