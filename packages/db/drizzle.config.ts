import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

export default {
  out: "./src/migrations",
  schema: "./src/schemas/**",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
  verbose: true,
} satisfies Config;
