import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.server";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  // host: process.env.DATABASE_HOST!,
  // port: parseInt(process.env.DATABASE_PORT!),
  // user: process.env.DATABASE_USER!,
  // password: process.env.DATABASE_PASSWORD!,
  // database: process.env.DATABASE_NAME!,
  // ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
