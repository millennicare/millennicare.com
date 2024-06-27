import * as jose from "jose";
import { createDate, TimeSpan } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

import { lucia } from "@millennicare/auth";
import { env } from "@millennicare/auth/env";
import { and, eq } from "@millennicare/db";
import { db } from "@millennicare/db/client";
import { EmailVerificationCode, User } from "@millennicare/db/schema";
import { createAccount, createCustomer } from "@millennicare/lib";

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
  type?: "caregiver" | "careseeker",
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

export const getStripeId = async (
  type: "caregiver" | "careseeker",

  email: string,
  name?: string,
) => {
  if (!name) {
    throw new Error();
  }

  if (type === "caregiver") {
    const account = await createAccount(email);
    return account.id;
  } else {
    const customer = await createCustomer({ email, name });
    return customer.id;
  }
};
