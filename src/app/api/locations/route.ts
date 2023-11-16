import { type NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      locationId: string;
    };
    const result = await client.send(
      new SearchPlaceIndexForTextCommand({
        IndexName: "UsEastPlaceIndex",
        Text: body.locationId,
        FilterCountries: ["USA"],
        FilterCategories: ["PostalCodeType"],
      }),
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: true, message: "Bad zip code" });
  }
}
