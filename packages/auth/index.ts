/* eslint-disable @typescript-eslint/unbound-method */
/* @see https://github.com/nextauthjs/next-auth/pull/8932 */

import { decode, encode } from "@auth/core/jwt";
import Credentials from "@auth/core/providers/credentials";
import type { DefaultSession } from "@auth/core/types";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { verify } from "argon2";
import NextAuth from "next-auth";

import { db, eq, tableCreator } from "@millennicare/db";
import { users } from "@millennicare/db/schema/auth";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db, tableCreator),
  providers: [
    Credentials({
      id: "credentials",
      name: "MillenniCare",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Please enter an email and password");
        }

        console.log(credentials);
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });
        if (!user) {
          console.log("no user");
          throw new Error("Incorrect email or password, please try again.");
        }

        const passwordsMatch = await verify(
          user.password,
          credentials.password as string,
        );

        if (!passwordsMatch) {
          throw new Error("Incorrect email or password, please try again.");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    jwt: ({ user, token }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  session: {
    strategy: "jwt",
  },
  jwt: { encode, decode },
  pages: {
    signIn: "/auth/login",
  },
});
