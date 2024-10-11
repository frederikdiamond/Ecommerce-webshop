import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useActionData, useLoaderData, json } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { CustomLink } from "~/components/Buttons";
import LoginForm from "./login-form";
import { AuthorizationError } from "remix-auth";

export type ActionDataLogin = {
  error?: {
    formError?: string[];
    fieldErrors?: {
      login?: string[];
      password?: string[];
    };
  };
  fields?: {
    login?: string;
    password?: string;
  };
};

export const badRequest = <T,>(data: T) => json<T>(data, { status: 400 });

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("form", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return badRequest<ActionDataLogin>({
        error: { formError: [String(error.message)] },
      });
    }

    console.error("Unexpected error during authentication:", error);
    return badRequest<ActionDataLogin>({
      error: { formError: ["An unexpected error occurred. Please try again."] },
    });
  }
}

type LoaderData = {
  error?: {
    formError: string[];
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
}

export default function Login() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<typeof action>();

  const error = actionData?.error ?? loaderData?.error;

  console.log("Action Data:", actionData);
  console.log("Loader Data:", loaderData);

  return (
    <main>
      <div className="mt-52 flex flex-col items-center gap-10">
        <h1 className="text-center text-2xl font-semibold">Login</h1>

        <LoginForm error={error} />

        <div className="mt-5 flex w-[170px] flex-col items-center gap-2.5">
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
    </main>
  );
}
