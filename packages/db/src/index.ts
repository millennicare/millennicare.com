import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as address from "./schema/address";
import * as appointment from "./schema/appointment";
import * as auth from "./schema/auth";
import * as child from "./schema/child";
import * as contactUs from "./schema/contact-us";
import * as review from "./schema/review";
import * as service from "./schema/service";
import * as waitlist from "./schema/waitlist";

export const schema = {
  ...address,
  ...appointment,
  ...auth,
  ...child,
  ...contactUs,
  ...review,
  ...service,
  ...waitlist,
};

export * from "./validations";

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const connection = connect({
  host: process.env.DB_HOST!,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
});

export const db = drizzle(connection, { schema });
