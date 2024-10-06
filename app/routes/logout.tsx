import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/routes/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
  return redirect("/login");
}
