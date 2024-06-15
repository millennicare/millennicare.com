import { config } from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

import { db } from "./client";

config({ path: "../../.env" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("migration completed");
  } catch (error) {
    console.error(`Error during migration: ${error}}`);
    process.exit(1);
  }
};

main();
