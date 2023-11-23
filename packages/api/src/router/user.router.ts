import { TRPCError } from "@trpc/server";
import * as argon from "argon2";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import validator from "validator";
import * as z from "zod";

import { eq } from "@millennicare/db";
import {
  careseekers as careseekerSchema,
  users as userSchema,
} from "@millennicare/db/schema/auth";
import { children as childSchema } from "@millennicare/db/schema/child";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

dotenv.config({
  path: "../../../../.env",
});

function generateToken(userId: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  const token = jwt.sign(userId, process.env.JWT_SECRET, { expiresIn: "24h" });

  return token;
}

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const user = await db.query.users.findFirst({
      where: eq(userSchema.id, session.user.id),
    });

    return user;
  }),
  careseekerRegister: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: z.string(),
        birthdate: z.date(),
        profilePicture: z.union([z.string(), z.undefined()]),
        phoneNumber: z.string().refine(validator.isMobilePhone),
        userType: z.enum(["careseeker", "caregiver", "admin"]),
        // careseeker fields
        children: z.array(
          z.object({
            name: z.string(),
            age: z.number().int(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const existingUser = await db.query.users.findFirst({
        where: eq(userSchema.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user already exists with this email address.",
        });
      }

      const hashedPassword = await argon.hash(input.password);
      const { children, ...rest } = input;

      const res = await db.transaction(async (tx) => {
        // first create user record
        const user = await tx
          .insert(userSchema)
          .values({ ...rest, password: hashedPassword });

        // then careseeker record
        const careseeker = await tx
          .insert(careseekerSchema)
          .values({ userId: user.insertId });

        // create child record
        const careseekerId = careseeker.insertId;
        await tx.insert(childSchema).values(
          children.map((child) => {
            return { name: child.name, age: child.age, careseekerId };
          }),
        );

        return user.insertId;
      });

      // send confirmation email
      const token = generateToken(res);

      return { message: "Sign up successful.", token };
    }),
  findDuplicateEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const user = await db.query.users.findFirst({
        where: eq(userSchema.email, input.email),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "A user already exists with this email address.",
        });
      }
    }),
});
