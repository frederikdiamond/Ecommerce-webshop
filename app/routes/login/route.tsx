import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <main>
      <div className="mt-52">
        <h1>Login</h1>
        <Form method="post">
          <p>Email</p>
          <input type="email" id="email" name="email" required />
          <p>Password</p>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            required
          />
          <button type="submit">Sign In</button>
        </Form>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
      </div>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  console.log("Received form data:", Object.fromEntries(formData));

  console.log({ email, password });

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      failureRedirect: "/login",
      throwOnError: true,
    });
  } catch (error) {
    console.error("Authentication error:", error);
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ error: "Authentication failed" }, { status: 400 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}
