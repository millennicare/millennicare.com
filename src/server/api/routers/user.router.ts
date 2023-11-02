import * as z from "zod";
import validator from "validator";

import { publicProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  register: publicProcedure
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
          message: "A user already exists with this email address",
        });
      }

      const careseeker = await ctx.db.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          profilePicture: input.profilePicture,
          email: input.email,
          password: input.password,
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
      return careseeker;
    }),
  // send email
});
