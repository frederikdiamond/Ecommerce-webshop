import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import * as argon2 from "argon2";
import { db } from "~/db/index.server";
import { users } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { User } from "~/types/UserTypes";

const authenticator = new Authenticator<User>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const login = form.get("login") as string;
  const password = form.get("password") as string;

  const isEmail = (input: string) => /\S+@\S+\.\S+/.test(input);

  const query = isEmail(login)
    ? db.select().from(users).where(eq(users.email, login))
    : db.select().from(users).where(eq(users.username, login));

  const [user] = await query.execute();

  if (!user) {
    throw new AuthorizationError("Invalid email or username");
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, password);

  if (!isPasswordValid) {
    throw new AuthorizationError();
  }

  if (!isPasswordValid) {
    throw new AuthorizationError("Incorrect password");
  }

  return user;
});

authenticator.use(formStrategy, "form");

export { authenticator };
