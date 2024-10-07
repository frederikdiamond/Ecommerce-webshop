import { db } from "~/db/index.server";
import { users } from "~/db/schema.server";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { json } from "@remix-run/node";

type RegisterForm = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  username: string;
  email: string;
  password: string;
};

export const createUser = async (user: RegisterForm) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email))
    .execute();

  if (existingUser.length > 0) {
    return json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await argon2.hash(user.password);

  const [newUser] = await db
    .insert(users)
    .values({
      username: user.username,
      email: user.email,
      passwordHash: hashedPassword,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      dateOfBirth: user.dateOfBirth || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      role: "user",
    })
    .returning();

  return {
    id: newUser.id,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    username: user.username,
    email: user.email,
  };
};
