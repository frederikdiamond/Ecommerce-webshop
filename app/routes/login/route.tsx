import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { CustomButton, CustomLink } from "~/components/Buttons";
import { FloatingLabelInput } from "~/components/TextInput";
import { useEffect, useState } from "react";
import { AuthorizationError } from "remix-auth";

export async function action({ request }: ActionFunctionArgs) {
  console.log("Action triggered");
  try {
    return authenticator.authenticate("form", request, {
      successRedirect: "/",
      // failureRedirect: "/login",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      const errorMessage =
        error.message === "User not found"
          ? { login: "User not found. Please check your username or email." }
          : error.message === "Incorrect password"
            ? { password: "Incorrect password. Please try again." }
            : { general: "An authentication error occurred." };

      return json({ errors: errorMessage }, { status: 401 });
    }

    return json(
      {
        errors: { general: "An unexpected error occurred. Please try again." },
      },
      { status: 500 },
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  // console.log("Action data:", actionData);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  useEffect(() => {
    setIsFormValid(
      formData.login.trim() !== "" && formData.password.trim() !== "",
    );
  }, [formData.login, formData.password]);

  return (
    <main>
      <div className="mt-52 flex flex-col items-center gap-10">
        <h1 className="text-center text-2xl font-semibold">Login</h1>
        <Form method="post" className="flex w-96 flex-col items-center gap-5">
          <FloatingLabelInput
            label="Username or Email"
            name="login"
            id="login"
            value={formData.login}
            onChange={(e) => handleInputChange(e, "login")}
            className={`${actionData?.errors?.login ? "border-red-500" : ""}`}
            required
          />
          <FloatingLabelInput
            label="Password"
            name="password"
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            className={`${actionData?.errors?.password ? "border-red-500" : ""}`}
            required
          />

          {actionData?.errors?.login && (
            <p className="text-sm text-red-500">{actionData.errors.login}</p>
          )}

          {actionData?.errors?.password && (
            <p className="text-sm text-red-500">{actionData.errors.password}</p>
          )}

          {actionData?.errors?.general && (
            <p className="text-sm text-red-500">{actionData.errors.general}</p>
          )}

          <div className="mt-5 flex w-[170px] flex-col items-center gap-10">
            <CustomButton
              type="submit"
              className={`w-full ${!isFormValid ? "active:none cursor-not-allowed opacity-50" : ""}`}
            >
              Login
            </CustomButton>
            <div className="flex w-full flex-col items-center gap-2.5">
              <p className="text-center">Don&apos;t already have an account?</p>
              <CustomLink
                url="/create-account"
                variant="secondary"
                className="w-full"
              >
                Create Account
              </CustomLink>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}
