import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server"; // Adjust this import path as needed

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
  const form = await request.formData();
  const email = form.get("email");
  const username = form.get("username");
  const password = form.get("password");
  const confirmPassword = form.get("confirmPassword");

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return json({ error: "Invalid form submission" }, { status: 400 });
  }

  if (!email || !password || !confirmPassword) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match" }, { status: 400 });
  }

  try {
    const response = await fetch("/api/create-account", {
      method: "POST",
      body: form,
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return json({ error: data.error }, { status: response.status });
    }

    // After creating the account, log the user in
    await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      failureRedirect: "/login",
      //   context: { formData: form },
    });
  } catch (error) {
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
