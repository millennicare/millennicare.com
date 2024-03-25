import type { Config } from "drizzle-kit";

const connectionString = [
  "postgres://" +
    process.env.POSTGRES_USER +
    ":" +
    process.env.POSTGRES_PASSWORD +
    "@" +
    process.env.POSTGRES_HOST +
    ":" +
    process.env.POSTGRES_PORT +
    "/" +
    process.env.POSTGRES_DB,
].join("");

export default {
  schema: "./src/schema",
  driver: "pg",
  dbCredentials: {
    // connectionString: process.env.DATABASE_URL!,
    connectionString,
  },
  tablesFilter: ["millennicare_*"],
} satisfies Config;
