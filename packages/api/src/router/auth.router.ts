import { hash, verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import * as jose from "jose";
import { z } from "zod";

import { and, eq } from "@millennicare/db";
import {
  Address,
  Careseeker,
  Child,
  User,
  UserInfo,
} from "@millennicare/db/schema";
import {
  createCustomer,
  getLocationDetailsFromPlaceId,
  sendPasswordResetEmail,
} from "@millennicare/lib";
import {
  createAddressSchema,
  createChildSchema,
  createUserInfoSchema,
  createUserSchema,
  signInSchema,
} from "@millennicare/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createSession,
  createToken,
  findDuplicateUser,
} from "../utils/helpers";

export const authRouter = createTRPCRouter({
  /**
   * Register a new user. Will update this in v2 to include a verification email
   * and a more robust user registration process.
   */
  register: publicProcedure
    .input(createUserSchema)
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

      /**
       * so typescript isn't angy
       */
      if (!input.password) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const hashed = await hash(input.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const returnUser = await db
        .insert(User)
        .values({ ...input, password: hashed })
        .returning({ insertedId: User.id });

      if (!returnUser[0]) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const session = await createSession(
        returnUser[0].insertedId,
        input.email,
      );

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

      if (!user?.password) {
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

      return { id: user.id, email: user.email };
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
  // careseeker register with password
  // need to find an better way to handle oauth login as well
  careseekerRegister: publicProcedure
    .input(
      createUserSchema
        .omit({ type: true })
        .required({ password: true })
        .and(
          createUserInfoSchema.pick({
            phoneNumber: true,
            name: true,
            birthdate: true,
          }),
        )
        .and(
          createAddressSchema.omit({
            userId: true,
            longitude: true,
            latitude: true,
          }),
        )
        .and(
          z.object({
            children: z.array(createChildSchema.omit({ userId: true })),
          }),
        ),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.password) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const { db } = ctx;
      // check if there is an existing user with a careseeker account already
      // since careseeker accounts can also create a caregiver account technically
      const existingUser = await db.query.User.findFirst({
        where: and(eq(User.email, input.email), eq(User.type, "careseeker")),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      const customer = await createCustomer({
        name: input.name,
        email: input.email,
      });
      const hashed = await hash(input.password);
      // get location details based on PlaceID passed from registration
      const details = await getLocationDetailsFromPlaceId(input.placeId);
      const res = await db.transaction(async (tx) => {
        const user = await tx
          .insert(User)
          .values({
            email: input.email,
            password: hashed,
            type: "careseeker",
          })
          .returning({ insertedId: User.id });
        if (!user[0]) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
        const userId = user[0].insertedId;

        await tx.insert(UserInfo).values({
          userId,
          name: input.name,
          phoneNumber: input.phoneNumber,
          birthdate: input.birthdate,
          stripeId: customer.id,
        });
        await tx.insert(Careseeker).values({
          userId,
        });
        await tx.insert(Child).values(
          input.children.map((child) => ({
            userId,
            age: child.age,
            name: child.name,
          })),
        );
        await tx.insert(Address).values({
          line1: details.line1,
          line2: details.line2,
          city: details.city,
          state: details.state,
          zipCode: details.zipCode,
          longitude: details.longitude,
          latitude: details.latitude,
          placeId: input.placeId,
          userId,
        });
        return userId;
      });

      const session = await createSession(res, input.email);
      return { session };
    }),
});
