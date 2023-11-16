import { type NextRequest, NextResponse } from "next/server";
import {
  LocationClient,
  SearchPlaceIndexForSuggestionsCommand,
} from "@aws-sdk/client-location";
import { env } from "~/env.mjs";
import { withAPIKey } from "@aws/amazon-location-utilities-auth-helper";

const apiKey = env.AWS_LOCATION_SUGGESTION_KEY;
const authHelper = await withAPIKey(apiKey);

const client = new LocationClient({
  region: "us-east-1",
  ...authHelper.getLocationClientConfig(),
});

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      zipCode: string;
    };

    const response = await client.send(
      new SearchPlaceIndexForSuggestionsCommand({
        IndexName: "SuggestionIndex",
        Text: body.zipCode,
        FilterCountries: ["USA"],
        FilterCategories: ["PostalCodeType"],
      }),
    );
    if (!response.Results) {
      return;
    }
    const suggestion = response.Results[0];
    const elems = suggestion!.Text!.split(",");
    const str = `${elems[1]}, ${elems[2]}`;

    return NextResponse.json(str);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Error" });
  }
}
