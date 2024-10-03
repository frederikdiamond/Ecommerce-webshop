import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

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

  try {
    const apiUrl = new URL("/api/create-account", request.url);
    const apiRequest = new Request(apiUrl, {
      method: "POST",
      body: form,
    });

    const response = await fetch(apiRequest);
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
      successRedirect: "/",
      failureRedirect: "/login",
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
      <div className="mt-52">
        <h1>Create Account</h1>
        <Form method="post">
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" />
          </div>
          <div>
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input type="date" id="dateOfBirth" name="dateOfBirth" />
          </div>
          <button type="submit">Create Account</button>
        </Form>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
      </div>
    </main>
  );
}
