import * as z from "zod";
import validator from "validator";
import { TRPCError } from "@trpc/server";
import * as argon from "argon2";

import { publicProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { db, userId } = ctx;
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        careseeker: {
          include: {
            children: true,
          },
        },
      },
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
        type: z.enum(["careseeker", "caregiver"]),
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
      const existingUser = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user already exists with this email address.",
        });
      }

      const hashed = await argon.hash(input.password);

      await ctx.db.user.create({
        data: {
          name: input.firstName + " " + input.lastName,
          firstName: input.firstName,
          lastName: input.lastName,
          profilePicture: input.profilePicture,
          email: input.email,
          password: hashed,
          birthdate: input.birthdate,
          phoneNumber: input.phoneNumber,
          type: input.type,
          careseeker: {
            create: {
              children: {
                create: input.children,
              },
            },
          },
        },
        include: {
          careseeker: {
            include: {
              children: true,
            },
          },
        },
      });
      return {
        status: 201,
        message: "Sign up successful!",
      };
    }),
  // send email
  caregiverRegister: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: z.string(),
        birthdate: z.date(),
        profilePicture: z.union([z.string(), z.undefined()]),
        phoneNumber: z.string().refine(validator.isMobilePhone),
        type: z.enum(["careseeker", "caregiver"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user already exists with this email address.",
        });
      }

      const hashed = await argon.hash(input.password);
      await ctx.db.user.create({
        data: {
          name: input.firstName + " " + input.lastName,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: hashed,
          birthdate: input.birthdate,
          profilePicture: input.profilePicture,
          phoneNumber: input.phoneNumber,
          type: input.type,
          caregiver: {
            create: true,
          },
        },
        include: {
          caregiver: true,
        },
      });

      return { status: 201, message: "Sign up successful" };
    }),
  findDuplicateEmail: publicProcedure
    .input(z.string().email())
    .mutation(async ({ ctx, input }) => {
      const duplicate = await ctx.db.user.findFirst({
        where: {
          email: input,
        },
      });
      if (duplicate) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user already exists with this email address",
        });
      }
    }),
});
