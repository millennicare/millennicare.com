import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as accounts from "./schema/account";
import * as addresses from "./schema/address";
import * as appointments from "./schema/appointment";
import * as caregivers from "./schema/caregiver";
import * as careseekers from "./schema/careseeker";
import * as children from "./schema/child";
import * as contactUs from "./schema/contact-us";
import * as services from "./schema/service";
import * as sessions from "./schema/session";
import * as users from "./schema/user";
import * as userInfo from "./schema/user-info";
import * as waitlist from "./schema/waitlist";

export const schema = {
  ...accounts,
  ...addresses,
  ...appointments,
  ...caregivers,
  ...careseekers,
  ...children,
  ...contactUs,
  ...services,
  ...sessions,
  ...users,
  ...userInfo,
  ...waitlist,
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { pgTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

export const db = drizzle(pool, { schema });
