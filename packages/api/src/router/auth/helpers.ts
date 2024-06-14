import * as jose from "jose";

import { lucia } from "@millennicare/auth";
import { and, db, eq, schema } from "@millennicare/db";

export async function createToken(userId: string, expTime?: string) {
  const secret = new TextEncoder().encode(process.env.SYMMETRIC_KEY);
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
  return await db.query.userTable.findFirst({
    where: type
      ? and(eq(schema.userTable.email, email), eq(schema.userTable.type, type))
      : eq(schema.userTable.email, email),
  });
}

export async function createSession(userId: string, email: string) {
  const session = await lucia.createSession(userId, { email });
  return session;
}
