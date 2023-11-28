import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as address from "./schema/address";
import * as appointment from "./schema/appointment";
import * as auth from "./schema/auth";
import * as child from "./schema/child";
import * as review from "./schema/review";
import * as service from "./schema/service";
import * as waitlist from "./schema/waitlist";

export const schema = {
  ...auth,
  ...address,
  ...appointment,
  ...child,
  ...service,
  ...waitlist,
  ...review,
};

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

export const db = drizzle(
  new Client({
    url: process.env.DATABASE_URL,
  }).connection(),
  { schema },
);
