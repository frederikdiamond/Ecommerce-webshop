import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { FloatingLabelInput } from "~/components/TextInput";
import { CustomButton, CustomLink } from "~/components/Buttons";
import { useState } from "react";
import { createUser } from "~/utils/createUser.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
  // const form = await request.formData();
  const clonedRequest = request.clone();
  const form = await clonedRequest.formData();
  const action = form.get("_action");
  const firstName = form.get("firstName")?.toString() || "";
  const lastName = form.get("lastName")?.toString() || "";
  const dateOfBirth = form.get("dateOfBirth")?.toString() || "";
  const username = form.get("username")?.toString() || "";
  const email = form.get("email")?.toString() || "";
  const password = form.get("password")?.toString() || "";
  const confirmPassword = form.get("confirmPassword")?.toString() || "";

  if (
    !firstName ||
    !lastName ||
    !username ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    return json(
      { error: "All fields are required", form: action },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match" }, { status: 400 });
  }

  await createUser({
    firstName,
    lastName,
    username,
    dateOfBirth,
    email,
    password,
  });

  return redirect("/login");
}

export default function CreateAccount() {
  const actionData = useActionData<typeof action>();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <main>
      <div className="mt-52 flex flex-col items-center gap-10">
        <h1 className="text-center text-2xl font-semibold">Create Account</h1>
        <Form method="post" className="flex w-96 flex-col items-center gap-5">
          <FloatingLabelInput
            label="First Name"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange(e, "firstName")}
            required
          />
          <FloatingLabelInput
            label="Last Name"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange(e, "lastName")}
            required
          />
          <div className="flex w-full justify-between px-4">
            <label htmlFor="dateOfBirth" className="font-semibold">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange(e, "dateOfBirth")}
            />
          </div>
          <FloatingLabelInput
            label="Username"
            name="username"
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange(e, "username")}
            required
          />
          <FloatingLabelInput
            label="Email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
            required
          />
          <FloatingLabelInput
            label="Password"
            name="password"
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            required
          />
          <FloatingLabelInput
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange(e, "confirmPassword")}
            required
          />

          <div className="mt-5 flex w-[170px] flex-col items-center gap-10">
            <CustomButton type="submit" className="w-full">
              Create Account
            </CustomButton>
            <div className="flex w-full flex-col items-center gap-2.5">
              <p className="text-center">Already have an account?</p>
              <CustomLink url="/login" variant="secondary" className="w-full">
                Login
              </CustomLink>
            </div>
          </div>
        </Form>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
      </div>
    </main>
  );
}
