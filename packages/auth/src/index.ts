import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "@millennicare/db/client";
import { Session, User } from "@millennicare/db/schema";

import { env } from "../env";

export type { Session, User } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "millennicare-session",
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
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

export const validateToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await lucia.validateSession(sessionToken);
  return session;
};

export const invalidateSession = async (token: string) => {
  await lucia.invalidateSession(token);
};

/**
 * Logs user out everywhere on all devices
 */
export const invalidateAllSessions = async (email: string) => {
  await lucia.invalidateUserSessions(email);
};
