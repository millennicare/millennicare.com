import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

config({ path: "../../.env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});
const db = drizzle(pool);

async function main() {
  try {
    await migrate(db, { migrationsFolder: "./src/migrations/" });
    await pool.end();
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(() => console.log("migrations applied"))
  .catch((error) => console.error("An error occurred:", error));
