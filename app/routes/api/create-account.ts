import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import * as argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import { db } from "~/db/index.server";
import { users } from "~/db/schema.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const form = await request.formData();
  const email = form.get("email");
  const username = form.get("username");
  const password = form.get("password");
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const dateOfBirth = form.get("dateOfBirth");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return json({ error: "Invalid form submission" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .execute();
    if (existingUser.length > 0) {
      return json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create the user in the database
    const [newUser] = await db
      .insert(users)
      .values({
        username: username,
        email: email,
        passwordHash: hashedPassword,
        firstName: firstName ? String(firstName) : null,
        lastName: lastName ? String(lastName) : null,
        dateOfBirth: dateOfBirth ? String(dateOfBirth) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        role: "user",
      })
      .returning();

    return json({ success: true, userId: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("Account creation error:", error);
    return json({ error: "Failed to create account" }, { status: 500 });
  }
}
