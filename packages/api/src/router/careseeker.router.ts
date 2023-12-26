import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import validator from "validator";
import * as z from "zod";

import { eq, schema } from "@millennicare/db";
import { createCustomer, deleteObject } from "@millennicare/lib";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const careseekerRouter = router({
  careseekerRegister: publicProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        birthdate: z.date(),
        profilePicture: z.string().optional(),
        phoneNumber: z.string().refine(validator.isMobilePhone),
        userType: z.enum(["careseeker", "caregiver"]),
        children: z.array(
          z.object({
            age: z.number(),
            name: z.string(),
          }),
        ),
        latitude: z.number(),
        longitude: z.number(),
        zipCode: z.string().length(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const stripe = await createCustomer(
        input.firstName,
        input.lastName,
        input.email,
      );

      await db.transaction(async (tx) => {
        // first create user record
        await tx.insert(schema.users).values({
          id: input.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          birthdate: input.birthdate,
          profilePicture: input.profilePicture,
          phoneNumber: input.phoneNumber,
          userType: "careseeker",
        });
        // then location
        await tx.insert(schema.addresses).values({
          userId: input.id,
          latitude: input.latitude,
          longitude: input.longitude,
          zipCode: input.zipCode,
        });
        // then careseeker
        await tx.insert(schema.careseekers).values({
          userId: input.id,
          stripeId: stripe.id,
        });

        // then kids
        await tx.insert(schema.children).values(
          input.children.map((child) => {
            return {
              userId: input.id,
              age: child.age,
              name: child.name,
            };
          }),
        );
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      console.log(input);
      await db
        .update(schema.careseekers)
        .set({})
        .where(eq(schema.careseekers.userId, userId));
    }),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const { db, userId } = ctx;

    try {
      // get user info
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });
      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // need to delete address, children, user
      await db.transaction(async (tx) => {
        await tx
          .delete(schema.addresses)
          .where(eq(schema.addresses.userId, userId));
        await tx
          .delete(schema.children)
          .where(eq(schema.children.userId, userId));
        await tx
          .delete(schema.careseekers)
          .where(eq(schema.careseekers.id, userId));
        await tx.delete(schema.users).where(eq(schema.users.id, userId));
      });

      // need to delete s3, clerk from lib
      await clerkClient.users.deleteUser(userId);
      if (user.profilePicture) {
        await deleteObject(user.profilePicture);
      }
    } catch (error) {
      console.log(error);
    }
  }),
});
