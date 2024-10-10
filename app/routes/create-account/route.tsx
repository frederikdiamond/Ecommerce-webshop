// import { json, redirect } from "@remix-run/node";
import { json, redirect, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { createUser } from "~/utils/createUser.server";
import { CreateAccountForm } from "./create-account-form";
import { CustomLink } from "~/components/Buttons";

export function badRequest<TActionData>(data: TActionData, status = 400) {
  return json<TActionData>(data, { status });
}

export type ActionDataCreateAccount = {
  error?: {
    formError?: string[];
    fieldErrors?: {
      firstName?: string[];
      lastName?: string[];
      dateOfBirth?: string[];
      username?: string[];
      email?: string[];
      password?: string[];
      confirmPassword?: string[];
    };
  };
  fields?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();
  const form = await clonedRequest.formData();
  const firstName = form.get("firstName")?.toString() || "";
  const lastName = form.get("lastName")?.toString() || "";
  const dateOfBirth = form.get("dateOfBirth")?.toString() || "";
  const username = form.get("username")?.toString() || "";
  const email = form.get("email")?.toString() || "";
  const password = form.get("password")?.toString() || "";
  const confirmPassword = form.get("confirmPassword")?.toString() || "";

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof dateOfBirth !== "string" ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return badRequest<ActionDataCreateAccount>({
      error: { formError: ["Form not submitted correctly."] },
    });
  }

  const fields = {
    firstName,
    lastName,
    dateOfBirth,
    username,
    email,
    password,
    confirmPassword,
  };

  const fieldErrors = {
    firstName: !firstName ? ["First name is required"] : undefined,
    lastName: !lastName ? ["Last name is required"] : undefined,
    username: !username ? ["Username is required"] : undefined,
    email: !email
      ? ["Email is required"]
      : !email.includes("@")
        ? ["Invalid email address"]
        : undefined,
    password: !password
      ? ["Password is required"]
      : password.length < 8
        ? ["Password must be at least 8 characters long"]
        : undefined,
    confirmPassword:
      password !== confirmPassword ? ["Passwords do not match"] : undefined,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest<ActionDataCreateAccount>({
      error: { fieldErrors },
      fields,
    });
  }

  try {
    await createUser({
      firstName,
      lastName,
      username,
      dateOfBirth,
      email,
      password,
    });
    return redirect("/login");
  } catch (error) {
    return badRequest<ActionDataCreateAccount>({
      error: { formError: ["An unexpected error occurred. Please try again."] },
      fields,
    });
  }
}

export default function CreateAccount() {
  const { error, fields } = useActionData<ActionDataCreateAccount>() ?? {};

  return (
    <main className="flex flex-col items-center">
      <div className="mt-52 flex w-[350px] flex-col items-center gap-10">
        <h1 className="text-center text-2xl font-semibold">Create Account</h1>

        <CreateAccountForm error={error} fields={fields} />

        <div className="mt-5 flex w-[170px] flex-col items-center gap-2.5">
          <p className="text-center">Already have an account?</p>
          <CustomLink url="/login" variant="secondary" className="w-full">
            Login
          </CustomLink>
        </div>
      </div>
    </main>
  );
}
