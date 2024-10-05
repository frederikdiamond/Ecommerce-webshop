import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { CustomButton, CustomLink } from "~/components/Buttons";
import { FloatingLabelInput } from "~/components/TextInput";

export default function Login() {
  const actionData = useActionData<typeof action>();
  return (
    <main>
      <div className="mt-52 flex flex-col items-center gap-10">
        <h1 className="text-center text-2xl font-semibold">Login</h1>
        <Form method="post" className="flex w-96 flex-col items-center gap-5">
          <FloatingLabelInput
            label="Username or Email"
            name="login"
            id="login"
            required
          />
          <FloatingLabelInput
            label="Password"
            name="password"
            id="password"
            type="password"
            required
          />

          <div className="mt-5 flex w-[170px] flex-col items-center gap-10">
            <CustomButton type="submit" className="w-full">
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
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
      </div>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const login = formData.get("login");
  const password = formData.get("password");

  const isEmail = (input: string) => /\S+@\S+\.\S+/.test(input);

  console.log("Received form data:", Object.fromEntries(formData));

  console.log({ login, password });

  if (!login || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    if (isEmail(login.toString())) {
      return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/",
        failureRedirect: "/login",
        throwOnError: true,
        context: { email: login, password },
      });
    } else {
      return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/",
        failureRedirect: "/login",
        throwOnError: true,
        context: { username: login, password },
      });
    }

    // Test before removing:
    // return await authenticator.authenticate("user-pass", request, {
    //   successRedirect: "/",
    //   failureRedirect: "/login",
    //   throwOnError: true,
    // });
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
