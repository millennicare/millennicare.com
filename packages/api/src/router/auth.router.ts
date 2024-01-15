import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcryptjs";
import * as jose from "jose";
import { z } from "zod";

import { eq, schema } from "@millennicare/db";
import { createCareseekerSchema } from "@millennicare/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const createToken = async (userId: string) => {
  const secret = new TextEncoder().encode(process.env.SYMMETRIC_KEY);
  const token = await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1 year")
    .sign(secret);

  return token;
};

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(32),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect email or password",
        });
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect email or password",
        });
      }

      const sessionToken = await createToken(user.id);

      return { sessionToken };
    }),
  careseekerRegister: publicProcedure
    .input(createCareseekerSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // hash password
      const hashed = await bcrypt.hash(input.password, 10);
      await db.transaction(async (tx) => {
        // create user
        await tx.insert(schema.users).values({
          email: input.email,
          password: hashed,
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          biography: input.biography,
          birthdate: input.birthdate,
          userType: "careseeker",
          profilePicture: input.profilePicture,
        });
        // create children
        // create address
      });
    }),
  // caregiverRegister
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return user;
  }),
  // update
  // delete
  checkDuplicateEmail: publicProcedure
    .input(z.string().email())
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, input),
      });

      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user already exists with that email",
        });
      }
    }),
});
