import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import * as argon2 from "argon2";
import { db } from "~/db/index.server";
import { users } from "~/db/schema.server";
import { eq } from "drizzle-orm";

type User = {
  id: number;
  email: string;
};

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ context }) => {
    if (!context?.formData) {
      throw new Error("FormData must be provided in the Context");
    }

    const form = context.formData as FormData;

    const email = form.get("email") as string;
    const password = form.get("password") as string;

    console.log("Received email:", email);
    console.log("Received password:", password);

    // Validate form inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find the user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    console.log("User found:", user);

    if (!user) {
      throw new Error("User not found");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return {
      id: user.id,
      email: user.email,
    };
  }),
  "user-pass",
);
