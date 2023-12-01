import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import validator from "validator";
import * as z from "zod";

import { eq } from "@millennicare/db";
import { addresses as addressSchema } from "@millennicare/db/schema/address";
import {
  careseekers as careseekerSchema,
  users as userSchema,
} from "@millennicare/db/schema/auth";
import { children as childSchema } from "@millennicare/db/schema/child";
import { deleteObject } from "@millennicare/lib";

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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.transaction(async (tx) => {
        // first create user record
        await tx.insert(userSchema).values({
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
        await tx.insert(addressSchema).values({
          userId: input.id,
          latitude: input.latitude,
          longitude: input.longitude,
        });
        // then careseeker
        await tx.insert(careseekerSchema).values({
          userId: input.id,
        });

        // then kids
        await tx.insert(childSchema).values(
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
  // update
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const { db, userId } = ctx;

    try {
      // get user info
      const user = await db.query.users.findFirst({
        where: eq(userSchema.id, userId),
      });
      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      // need to delete s3, clerk from lib
      await clerkClient.users.deleteUser(userId);
      if (user.profilePicture) {
        await deleteObject(user.profilePicture);
      }
      // need to delete address, children, user
      await db.transaction(async (tx) => {
        await tx.delete(addressSchema).where(eq(addressSchema.userId, userId));
        await tx.delete(childSchema).where(eq(childSchema.userId, userId));
        await tx
          .delete(careseekerSchema)
          .where(eq(careseekerSchema.id, userId));
        await tx.delete(userSchema).where(eq(userSchema.id, userId));
      });
    } catch (error) {}
  }),
});
