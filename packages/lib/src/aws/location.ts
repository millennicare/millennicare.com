import type {
  SearchPlaceIndexForSuggestionsCommandInput,
  SearchPlaceIndexForTextCommandInput,
} from "@aws-sdk/client-location";
import {
  LocationClient,
  SearchPlaceIndexForSuggestionsCommand,
  SearchPlaceIndexForTextCommand,
} from "@aws-sdk/client-location";
import { withAPIKey } from "@aws/amazon-location-utilities-auth-helper";

export const getLocationSuggestion = async (zipCode: string) => {
  const authHelper = await withAPIKey(process.env.AWS_LOCATION_SUGGESTION_KEY!);
  const client = new LocationClient({
    region: process.env.AWS_REGION!,
    ...authHelper.getLocationClientConfig(),
  });
  const params: SearchPlaceIndexForSuggestionsCommandInput = {
    IndexName: "SuggestionIndex",
    Text: zipCode,
    FilterCategories: ["PostalCodeType"],
    FilterCountries: ["USA"],
  };
  const command = new SearchPlaceIndexForSuggestionsCommand(params);
  const response = await client.send(command);

  if (!response.Results) {
    throw new Error("Invalid zip code.");
  }
  const suggestion = response.Results[0];
  const elems = suggestion!.Text!.split(",");
  const str = `${elems[1]}, ${elems[2]}`;

  return str;
};

export const getLocationDetails = async (zipCode: string) => {
  const authHelper = await withAPIKey(process.env.AWS_LOCATION_API_KEY!);
  const client = new LocationClient({
    region: process.env.AWS_REGION!,
    ...authHelper.getLocationClientConfig(),
  });
  const params: SearchPlaceIndexForTextCommandInput = {
    IndexName: "UsEastPlaceIndex",
    Text: zipCode,
    FilterCountries: ["USA"],
    FilterCategories: ["PostalCodeType"],
  };

  const command = new SearchPlaceIndexForTextCommand(params);
  const response = await client.send(command);

  if (!response.Results) {
    throw new Error("Bad zip code.");
  }

  const result = response.Results[0];
  if (!result?.Place?.Geometry?.Point) {
    throw new Error("Not enough information");
  }

  const latitude = result.Place.Geometry.Point[0];
  const longitude = result.Place.Geometry.Point[1];
  return { coordinates: { latitude, longitude } };
};

export const getAddressSuggestion = async (query: string) => {
  const authHelper = await withAPIKey(process.env.AWS_LOCATION_SUGGESTION_KEY!);
  const client = new LocationClient({
    region: process.env.AWS_REGION!,
    ...authHelper.getLocationClientConfig(),
  });

  const params: SearchPlaceIndexForSuggestionsCommandInput = {
    IndexName: "SuggestionIndex",
    Text: query,
    FilterCountries: ["USA"],
    MaxResults: 10,
  };

  const command = new SearchPlaceIndexForSuggestionsCommand(params);
  const response = await client.send(command);

  return response.Results;
};
