import type { CreateUser, SignInInput } from "@millennicare/validators";
import { TRPCError } from "@trpc/server";

import { lucia } from "../../auth";
import { getUserByEmail } from "../../auth/user";
import { validatePassword } from "../../utils/password";

export const signIn = async ({ input }: { input: SignInInput }) => {
  const user = await getUserByEmail(input.email);
  if (!user?.password) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Incorrect email or password",
    });
  }

  const isValidPassword = await validatePassword(input.password, user.password);
  if (!isValidPassword) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Incorrect email or password",
    });
  }

  const session = await lucia.createSession(user.id, { email: user.email });
  return { sessionId: session.id };
};

export const register = async ({ input }: { input: CreateUser }) => {
  const user = await getUserByEmail(input.email);
  if (user) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A user already exists with this email address",
    });
  }
};
