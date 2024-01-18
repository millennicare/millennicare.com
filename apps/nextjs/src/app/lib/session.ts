import type { SessionOptions } from "iron-session";

import { env } from "~/env";

export type SessionData = {
  sessionToken: string | null;
  isLoggedIn: boolean;
};

export const defaultSession: SessionData = {
  sessionToken: null,
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: env.NEXT_PUBLIC_SESSION_PASSWORD,
  cookieName: "millennicare-session-cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};
