import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useActionData, useLoaderData, json } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { CustomLink } from "~/components/Buttons";
import LoginForm from "./login-form";
import { getSession } from "~/services/session.server";
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

// type LoaderError = { message: string } | null;

// export async function loader({ request }: LoaderFunctionArgs) {
//   await authenticator.isAuthenticated(request, {
//     successRedirect: "/",
//   });
//   let session = await getSession(request.headers.get("cookie"));
//   const error = session.get(authenticator.sessionErrorKey) as LoaderError;
//   return json({ error });
// }

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSession(request.headers.get("cookie"));
  const error = session.get(authenticator.sessionErrorKey) as
    | string
    | undefined;

  const errorMessage = typeof error === "object" ? null : String(error);

  return json<LoaderData>({
    error: errorMessage ? { formError: [errorMessage] } : undefined,
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
