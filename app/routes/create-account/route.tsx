import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/routes/services/auth.server";
import { FloatingLabelInput } from "~/components/TextInput";
import { CustomButton, CustomLink } from "~/components/Buttons";

export async function loader({ request }: LoaderFunctionArgs) {
  // Check if the user is already authenticated
  const user = await authenticator.isAuthenticated(request);

  // Show home page if user is already authenticated
  if (user) {
    return redirect("/");
  }

  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();
  const form = await clonedRequest.formData();

  const email = form.get("email");
  const username = form.get("username");
  const password = form.get("password");
  const confirmPassword = form.get("confirmPassword");
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const dateOfBirth = form.get("dateOfBirth");

  console.log("Received form data:", {
    email,
    username,
    password,
    confirmPassword,
    firstName,
    lastName,
    dateOfBirth,
  });

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return json({ error: "Invalid form submission" }, { status: 400 });
  }

  if (!email || !username || !password || !confirmPassword) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match" }, { status: 400 });
  }

  const formDataObject = {
    email,
    username,
    password,
    confirmPassword,
    firstName,
    lastName,
    dateOfBirth,
  };

  try {
    const apiUrl = new URL("/api/create-account", request.url);
    // const apiRequest = new Request(apiUrl, {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObject),
      redirect: "follow",
      // body: form,
    });

    // const response = await fetch(apiRequest);
    // const data = await response.json();

    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { error: errorData.error || "An error occurred" },
        { status: response.status },
      );
    }

    // After creating the account, log the user in
    await authenticator.authenticate("user-pass", request, {
      successRedirect: "/login",
      failureRedirect: "/create-account",
    });
  } catch (error) {
    console.error("Account creation error:", error);
    return json({ error: "Failed to create account" }, { status: 500 });
  }
}

export default function CreateAccount() {
  const actionData = useActionData<typeof action>();

  return (
    <main>
      <div className="mt-52 flex flex-col items-center gap-10">
        <h1 className="text-center text-2xl font-semibold">Create Account</h1>
        <Form method="post" className="flex w-96 flex-col items-center gap-5">
          <FloatingLabelInput
            label="First Name"
            name="firstName"
            id="firstName"
            required
          />
          <FloatingLabelInput
            label="Last Name"
            name="lastName"
            id="lastName"
            required
          />
          <div className="flex w-full justify-between px-4">
            <label htmlFor="dateOfBirth" className="font-semibold">
              Date of Birth
            </label>
            <input type="date" id="dateOfBirth" name="dateOfBirth" />
          </div>
          <FloatingLabelInput
            label="Username"
            name="username"
            id="username"
            required
          />
          <FloatingLabelInput label="Email" name="email" id="email" required />
          <FloatingLabelInput
            label="Password"
            name="password"
            id="password"
            type="password"
            required
          />
          <FloatingLabelInput
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            type="password"
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
