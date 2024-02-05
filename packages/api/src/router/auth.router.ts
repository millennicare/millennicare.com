import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcryptjs";
import * as jose from "jose";
import { z } from "zod";

import { eq, schema } from "@millennicare/db";
import {
  createCustomer,
  getLocationDetails,
  sendResetPasswordEmail,
  updateCustomer,
} from "@millennicare/lib";
import {
  createCareseekerSchema,
  createUserSchema,
  updateUserSchema,
} from "@millennicare/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const createToken = async (userId: string, expTime?: string) => {
  const secret = new TextEncoder().encode(process.env.SYMMETRIC_KEY);
  const token = await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expTime ?? "1 year")
    .sign(secret);

  return token;
};

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
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
      let userId = "";

      // create all third party accounts
      const stripeResponse = await createCustomer({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
      });

      const { coordinates } = await getLocationDetails(input.address.zipCode);

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
          stripeId: stripeResponse.id,
        });

        // fetch user
        const user = await tx.query.users.findFirst({
          where: eq(schema.users.email, input.email),
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        userId = user.id;

        // create address
        await tx.insert(schema.addresses).values({
          userId: userId,
          zipCode: input.address.zipCode,
          longitude: coordinates.longitude!,
          latitude: coordinates.latitude!,
        });

        // create careseeker
        await tx.insert(schema.careseekers).values({
          userId: userId,
        });

        // create children
        await tx.insert(schema.children).values(
          input.children.map((child) => ({
            userId: userId,
            age: child.age,
            name: child.name,
          })),
        );
      });

      const sessionToken = await createToken(userId);
      return { sessionToken };
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
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      // update stripe info
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await updateCustomer({
        customerId: user.stripeId,
        ...input,
      });
      await db
        .update(schema.users)
        .set({ ...input })
        .where(eq(schema.users.id, userId));
    }),
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
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email({ message: "Invalid email address" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // find user in db
      const { email } = input;
      const { db } = ctx;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (!user) {
        return;
      }

      // if user exists, create a token and send email
      const token = await createToken(user.id, "1 hour");

      await sendResetPasswordEmail({ to: email, token });
      return;
    }),
  resetPassword: publicProcedure
    .input(
      createUserSchema.pick({ password: true }).extend({ token: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      // decrypt token
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

      // update password
      const hashed = await bcrypt.hash(input.password, 10);

      await db
        .update(schema.users)
        .set({ password: hashed })
        .where(eq(schema.users.id, userId));

      return { message: "Password successfully reset." };
    }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if current password is correct
      const { db, userId } = ctx;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const passwordsMatch = await bcrypt.compare(
        input.currentPassword,
        user.password,
      );
      if (!passwordsMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect password",
        });
      }

      const hashed = await bcrypt.hash(input.newPassword, 10);
      await db
        .update(schema.users)
        .set({ password: hashed })
        .where(eq(schema.users.id, userId));
    }),
});
