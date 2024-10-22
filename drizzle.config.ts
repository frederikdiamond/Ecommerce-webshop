import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/db/schema.server.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Local Testing
    //   host: process.env.DATABASE_HOST!,
    //   port: parseInt(process.env.DATABASE_PORT!),
    //   user: process.env.DATABASE_USER!,
    //   password: process.env.DATABASE_PASSWORD!,
    //   database: process.env.DATABASE_NAME!,
    // ssl: "allow",
  },
});
