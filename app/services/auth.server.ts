import { Authenticator, AuthorizationError } from "remix-auth";
import {
  getSession,
  commitSession,
  destroySession,
} from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import * as argon2 from "argon2";
import { db } from "~/db/index.server";
import { users } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { User } from "~/types/UserTypes";

const authenticator = new Authenticator<User>({
  getSession,
  commitSession,
  destroySession,
});

const formStrategy = new FormStrategy(async ({ form }) => {
  const login = form.get("login") as string;
  const password = form.get("password") as string;

  if (!login || !password) {
    console.error("Missing login or password");
    throw new AuthorizationError(
      "Username or email and password are required.",
    );
  }

  const isEmail = (input: string) => /\S+@\S+\.\S+/.test(input);

  const query = isEmail(login)
    ? db.select().from(users).where(eq(users.email, login))
    : db.select().from(users).where(eq(users.username, login));

  const [user] = await query.execute();

  if (!user) {
    console.error("User not found for login:", login);
    throw new AuthorizationError("User not found");
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, password);

  if (!isPasswordValid) {
    console.error("Incorrect password for user:", login);
    throw new AuthorizationError("Incorrect password");
  }

  return user;
});

authenticator.use(formStrategy, "form");

export { authenticator };
