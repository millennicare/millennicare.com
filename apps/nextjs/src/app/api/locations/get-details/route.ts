import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LocationClient,
  SearchPlaceIndexForTextCommand,
} from "@aws-sdk/client-location";
import { withAPIKey } from "@aws/amazon-location-utilities-auth-helper";

import { env } from "~/env.mjs";

const apiKey = env.AWS_LOCATION_API_KEY;
const authHelper = await withAPIKey(apiKey);

const client = new LocationClient({
  region: "us-east-1",
  ...authHelper.getLocationClientConfig(),
});

/**
 * @returns The lat/lng coordinates
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      zipCode: string;
    };

    if (body.zipCode.length !== 5) {
      return NextResponse.json({ status: 400, message: "Bad request" });
    }
    const response = await client.send(
      new SearchPlaceIndexForTextCommand({
        IndexName: "UsEastPlaceIndex",
        Text: body.zipCode,
        FilterCountries: ["USA"],
        FilterCategories: ["PostalCodeType"],
      }),
    );
    console.log(JSON.stringify(response, null, 2));
    if (!response.Results) {
      return NextResponse.json({ status: 400, message: "Bad zip code" });
    }

    const result = response.Results[0];
    if (!result?.Place?.Geometry?.Point) {
      throw new Error();
    }

    const lat = result.Place.Geometry.Point[0];
    const long = result.Place.Geometry.Point[1];

    return NextResponse.json({
      coordinates: {
        latitude: lat,
        longitude: long,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal server error.",
    });
  }
}
