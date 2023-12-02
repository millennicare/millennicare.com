import { TRPCError } from "@trpc/server";
import validator from "validator";
import * as z from "zod";

import { eq } from "@millennicare/db";
import { addresses as addressSchema } from "@millennicare/db/schema/address";
import {
  caregivers as caregiverSchema,
  users as userSchema,
} from "@millennicare/db/schema/auth";
import { createAccount, getAccountLink } from "@millennicare/lib";

import { publicProcedure, router } from "../trpc";

export const caregiverRouter = router({
  caregiverRegister: publicProcedure
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
        latitude: z.number(),
        longitude: z.number(),
        zipCode: z.string().length(5),
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
          userType: "caregiver",
        });
        // then location
        await tx.insert(addressSchema).values({
          userId: input.id,
          latitude: input.latitude,
          longitude: input.longitude,
          zipCode: input.zipCode,
        });
        // use lib/stripe to create Stripe account
        const account = await createAccount(input.email);
        // then caregiver
        await tx.insert(caregiverSchema).values({
          userId: input.id,
          stripeId: account.id,
        });
      });

      const caregiver = await db.query.caregivers.findFirst({
        where: eq(caregiverSchema.id, input.id),
      });

      if (!caregiver) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const link = await getAccountLink(caregiver.stripeId);
      return { url: link.url };
    }),
});
