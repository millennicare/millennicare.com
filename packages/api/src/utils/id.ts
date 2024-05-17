import { createId } from "@paralleldrive/cuid2";
import * as jose from "jose";

export const generateId = () => {
  return createId();
};

export const generateToken = async (userId: string, expTime?: string) => {
  const secret = new TextEncoder().encode(process.env.SYMMETRIC_KEY);
  const token = await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expTime ?? "1h")
    .sign(secret);
  return token;
};
