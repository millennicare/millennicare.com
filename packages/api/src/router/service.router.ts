import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { and, eq, schema } from "@millennicare/db";
import { getLocationDetails } from "@millennicare/lib";
import {
  createServiceSchema,
  selectServiceSchema,
} from "@millennicare/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const filterByLocation = (
  services: {
    zipCode: string;
    longitude: number;
    latitude: number;
    userId: string | null;
    serviceId: string;
  }[],
  coordinates: {
    longitude: number;
    latitude: number;
  },
  radius: number,
) => {
  const radians = 6371;
  const kilometers = radius * 1.690934;

  return services.filter((service) => {
    const { latitude, longitude } = coordinates;
    const dLat = degreesToRadians(latitude - service.latitude);
    const dLong = degreesToRadians(longitude - service.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(latitude)) *
        Math.cos(degreesToRadians(service.latitude)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = radians * c; // distance in KM
    return d < kilometers;
  });
};

const degreesToRadians = (point: number) => point * (Math.PI / 180);

export const serviceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createServiceSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      const caregiver = await db.query.caregiverTable.findFirst({
        where: eq(schema.caregiverTable.userId, userId),
      });
      if (!caregiver) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await db.insert(schema.serviceTable).values({ ...input });
    }),
  update: protectedProcedure
    .input(selectServiceSchema.partial().required({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      const caregiver = await db.query.userTable.findFirst({
        where: and(
          eq(schema.userTable.id, userId),
          eq(schema.userTable.type, "caregiver"),
        ),
      });
      if (!caregiver) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db
        .update(schema.serviceTable)
        .set({ ...input, userId: caregiver.id });
    }),
  getByCaregiver: publicProcedure
    .input(z.object({ caregiverId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const services = await ctx.db.query.serviceTable.findMany({
        where: eq(schema.serviceTable.id, input.caregiverId),
      });

      if (!services) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return services;
    }),
  getById: publicProcedure
    .input(z.object({ serviceId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.query.serviceTable.findFirst({
        where: eq(schema.serviceTable.id, input.serviceId),
      });
      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return service;
    }),
  delete: protectedProcedure
    .input(z.object({ serviceId: z.string().cuid2() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db
        .delete(schema.serviceTable)
        .where(eq(schema.serviceTable.id, input.serviceId));
    }),
  // finds services by a custom radius search query (default 5 mile)
  getByZipCode: publicProcedure
    .input(
      z.object({
        zipCode: z.string().length(5),
        category: z.enum([
          "child_care",
          "senior_care",
          "housekeeping",
          "petcare",
        ]),
        // for now, the max radius is 10
        radius: z.number().int().nonnegative().lte(10).optional().default(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      // get all caregivers in given radius from zipcode
      // 1. check if the supplied zip code is already in address table
      const location = await ctx.db.query.addressTable.findFirst({
        where: eq(schema.addressTable.zipCode, input.zipCode),
      });

      // if not present, fetch from aws location api
      const coords = {
        latitude: 0,
        longitude: 0,
      };

      if (!location) {
        const response = await getLocationDetails(input.zipCode);
        if (!response.coordinates.latitude || !response.coordinates.longitude) {
          return;
        }
        const { latitude, longitude } = response.coordinates;
        coords.latitude = latitude;
        coords.longitude = longitude;
      } else {
        coords.latitude = location.latitude;
        coords.longitude = location.longitude;
      }

      // 2. get a list of caregivers that offer that service
      const sq = db.$with("sq").as(
        db
          .select()
          .from(schema.caregiverTable)
          .innerJoin(
            schema.serviceTable,
            and(
              eq(schema.serviceTable.category, input.category),
              eq(schema.serviceTable.userId, schema.caregiverTable.userId),
            ),
          ),
      );

      // 3. then join that result with users/services and addresses
      const result = await db
        .with(sq)
        .select({
          zipCode: schema.addressTable.zipCode,
          longitude: schema.addressTable.longitude,
          latitude: schema.addressTable.latitude,
          userId: sq.caregivers.userId,
          serviceId: sq.services.id,
        })
        .from(sq)
        .innerJoin(
          schema.addressTable,
          eq(schema.addressTable.userId, sq.caregivers.userId),
        );

      // 3. filter caregivers list based on zip code
      return filterByLocation(result, coords, input.radius);
    }),
});
