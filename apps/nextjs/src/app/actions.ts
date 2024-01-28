import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

import type { SessionData } from "./lib/session";
import { sessionOptions } from "./lib/session";

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
    session.sessionToken = null;
  }

  return session;
};

export const logout = async () => {
  "use server";
  const session = await getSession();
  session.destroy();
};
