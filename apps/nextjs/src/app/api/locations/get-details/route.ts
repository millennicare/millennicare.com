import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getLocationDetails } from "@millennicare/lib";

/**
 * @returns The latitude/longitude coordinates
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      zipCode: string;
    };
    const response = await getLocationDetails(body.zipCode);
    const { latitude, longitude } = response.coordinates;
    return NextResponse.json({
      coordinates: {
        latitude,
        longitude,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal server error.",
    });
  }
}
