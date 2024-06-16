import * as jose from "jose";

import { env } from "@millennicare/auth/env";

export const generateToken = async (userId: string, expTime?: string) => {
  const secret = new TextEncoder().encode(env.SYMMETRIC_KEY);
  const token = await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expTime ?? "1h")
    .sign(secret);
  return token;
};
