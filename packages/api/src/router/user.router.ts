import { TRPCError } from "@trpc/server";
import * as argon from "argon2";
import * as dotenv from "dotenv";
// import * as jwt from "jsonwebtoken";
import validator from "validator";
import * as z from "zod";

import { eq } from "@millennicare/db";
import { careseekers, users as userSchema } from "@millennicare/db/schema/auth";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

dotenv.config({
  path: "../../../../.env",
});

// function generateToken(userId: string) {
//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET is not set");
//   }

//   const token = jwt.sign(userId, process.env.JWT_SECRET, { expiresIn: "24h" });

//   return token;
// }

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    // const user = await db
    //   .select()
    //   .from(users)
    //   .where(eq(users.id, session.user.id));
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
      const values = {
        ...input,
        password: hashedPassword,
      };

      // const newUser = await db.insert(careseekers).values(values);
      await db.insert(careseekers).values(values);
      // send confirmation email
      // const token = generateToken(id);

      return { message: "Sign up successful." };
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
