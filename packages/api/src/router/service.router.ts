import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { eq, schema } from "@millennicare/db";
import { getLocationDetails } from "@millennicare/lib";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const filterByLocation = (
  services: {
    zipCode: string;
    longitude: number;
    latitude: number;
    caregiverId: string;
    userId: string;
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
    .input(
      z.object({
        caregiverId: z.string().cuid2(),
        title: z.string(),
        description: z.string(),
        price: z.number().multipleOf(0.01),
        category: z.enum([
          "child_care",
          "senior_care",
          "housekeeping",
          "petcare",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;
      const caregiver = await db.query.caregivers.findFirst({
        where: eq(schema.caregivers.userId, userId),
      });
      if (!caregiver) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await db
        .insert(schema.services)
        .values({ ...input, caregiverId: caregiver.id });
    }),
  update: protectedProcedure
    .input(
      z
        .object({
          title: z.string(),
          description: z.string(),
          price: z.number().multipleOf(0.01),
          category: z.enum([
            "child_care",
            "senior_care",
            "housekeeping",
            "petcare",
          ]),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, userId } = ctx;

      const caregiver = await db.query.caregivers.findFirst({
        where: eq(schema.caregivers.userId, userId),
        columns: {
          id: true,
        },
      });
      if (!caregiver) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await db
        .update(schema.services)
        .set({ ...input, caregiverId: caregiver.id });
    }),
  getByCaregiver: publicProcedure
    .input(z.object({ caregiverId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const services = await ctx.db.query.services.findMany({
        where: eq(schema.caregivers.id, input.caregiverId),
      });

      if (!services) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return services;
    }),
  getById: publicProcedure
    .input(z.object({ serviceId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.query.services.findFirst({
        where: eq(schema.services.id, input.serviceId),
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
        .delete(schema.services)
        .where(eq(schema.services.id, input.serviceId));
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
      // has to be inefficient first
      // get all caregivers in given radius from zipcode
      // 1. check if the supplied zip code is already in address table
      const location = await ctx.db.query.addresses.findFirst({
        where: eq(schema.addresses.zipCode, input.zipCode),
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
      const sq = db
        .$with("sq")
        .as(
          db
            .select()
            .from(schema.caregivers)
            .innerJoin(
              schema.services,
              eq(schema.services.category, input.category),
            ),
        );
      // then join that result with users/services and addresses
      const result = await db
        .with(sq)
        .select({
          zipCode: schema.addresses.zipCode,
          longitude: schema.addresses.longitude,
          latitude: schema.addresses.latitude,
          caregiverId: sq.caregiver.id,
          userId: sq.caregiver.userId,
          serviceId: sq.service.id,
        })
        .from(sq)
        .innerJoin(
          schema.addresses,
          eq(schema.addresses.userId, sq.caregiver.userId),
        );

      // 3. filter caregivers list based on zip code
      return filterByLocation(result, coords, input.radius);
    }),
});
