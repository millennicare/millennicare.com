import { hash, verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import * as jose from "jose";
import { isWithinExpirationDate } from "oslo";
import { z } from "zod";

import { invalidateSession, lucia } from "@millennicare/auth";
import { eq } from "@millennicare/db";
import { EmailVerificationCode, User } from "@millennicare/db/schema";
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from "@millennicare/lib";
import { signInSchema, signUpSchema } from "@millennicare/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createSession,
  createToken,
  findDuplicateUser,
  generateEmailVerificationCode,
} from "../utils/helpers";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.token) {
      return { success: false };
    }
    await invalidateSession(opts.ctx.token);
    return { success: true };
  }),
  verifEmail: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const { user } = await lucia.validateSession(ctx.session.id);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const databaseCode = await db.query.EmailVerificationCode.findFirst({
        where: eq(User.id, user.id),
      });

      if (!databaseCode || input.code !== databaseCode.code) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      await db
        .delete(EmailVerificationCode)
        .where(eq(EmailVerificationCode.id, databaseCode.id));

      if (!isWithinExpirationDate(databaseCode.expiresAt)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verification code expired, please request a new one.",
        });
      }
      if (databaseCode.email !== user.email) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await db
        .update(User)
        .set({ emailVerified: true })
        .where(eq(User.id, user.id));

      const session = await createSession(user.id, user.email);
      return { session };
    }),
  register: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const existingUser = await findDuplicateUser(input.email, input.type);
      // if a user exists with the same type, throw duplicate error
      if (existingUser && existingUser.type === input.type) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }
      const hashed = await hash(input.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const res = await db.transaction(async (tx) => {
        const returnUser = await tx
          .insert(User)
          .values({ ...input, password: hashed, emailVerified: false })
          .returning({ insertedId: User.id });

        const userId = returnUser[0]?.insertedId;
        if (!userId) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
        const code = await generateEmailVerificationCode(userId, input.email);

        // const stripeId = await getStripeId(
        //   input.type,
        //   input.email,
        //   `${input.firstName} ${input.lastName}`,
        // );
        // // if user type is careseeker, create a Stripe customer obj
        // await tx.insert(UserInfo).values({
        //   userId: userId,
        //   firstName: input.firstName,
        //   lastName: input.lastName,
        //   phoneNumber: input.phoneNumber,
        //   birthdate: input.birthdate,
        //   gender: input.gender,
        //   stripeId: stripeId,
        // });

        return { userId, code };
      });

      if (!res.userId || !res.code) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      // send email verification code
      await sendEmailVerificationEmail({ email: input.email, code: res.code });

      const session = await createSession(res.userId, input.email);

      return { session };
    }),
  checkDuplicateEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const existingUser = await db.query.User.findFirst({
        where: eq(User.email, input.email),
      });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }
    }),
  updatePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      const user = await db.query.User.findFirst({
        where: eq(User.id, userId),
      });

      if (!user?.password) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const passwordsMatch = await verify(user.password, input.currentPassword);
      if (!passwordsMatch) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Old password must match.",
        });
      }

      const hashed = await hash(input.newPassword);
      await db
        .update(User)
        .set({
          password: hashed,
        })
        .where(eq(User.id, userId));
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string(),
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // decrypt password reset token
      const secret = new TextEncoder().encode(process.env.SYMMETRIC_KEY);
      const { payload } = await jose.jwtVerify(input.token, secret);

      if (payload.exp && payload.exp > Date.now()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Token has expired, please try again.",
        });
      }

      const userId = payload.sub;
      if (!userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const hashed = await hash(input.password);
      await db
        .update(User)
        .set({ password: hashed })
        .where(eq(User.id, userId));

      return { message: "Password successfully reset." };
    }),
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const user = await db.query.User.findFirst({
        where: eq(User.email, input.email),
      });

      if (!user) {
        return { message: "Reset email sent!" };
      }
      // generate a reset token
      const token = await createToken(user.id, "1 hour");
      await sendPasswordResetEmail({ to: input.email, token });
      return { message: "Reset email sent!" };
    }),
  login: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const user = await db.query.User.findFirst({
        where: eq(User.email, input.email),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect email or password",
        });
      }

      const validPassword = await verify(user.password, input.password);
      if (!validPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect email or password",
        });
      }
      const session = await createSession(user.id, user.email);
      return { session };
    }),
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const user = await db.query.User.findFirst({
      where: eq(User.id, session.user.id),
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return user;
  }),
});
