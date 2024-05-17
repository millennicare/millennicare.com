import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db, schema } from "@millennicare/db";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessionTable,
  schema.userTable,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "millennicare-session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (userAttributes) => ({
    email: userAttributes.email,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
}
