import * as jose from "jose";

import { lucia } from "@millennicare/auth";
import { env } from "@millennicare/auth/env";
import { and, eq } from "@millennicare/db";
import { db } from "@millennicare/db/client";
import { User } from "@millennicare/db/schema";

export async function createToken(userId: string, expTime?: string) {
  const secret = new TextEncoder().encode(env.SYMMETRIC_KEY);
  const token = await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expTime ?? "1h")
    .sign(secret);
  return token;
}

export async function findDuplicateUser(
  email: string,
  type?: "admin" | "caregiver" | "careseeker",
) {
  return await db.query.User.findFirst({
    where: type
      ? and(eq(User.email, email), eq(User.type, type))
      : eq(User.email, email),
  });
}

export async function createSession(userId: string, email: string) {
  const session = await lucia.createSession(userId, { email });
  return session;
}
