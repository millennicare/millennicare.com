import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["millennicare_*"],
  dialect: "postgresql",
} satisfies Config;
