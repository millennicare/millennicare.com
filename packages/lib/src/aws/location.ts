import type {
  GetPlaceCommandInput,
  SearchPlaceIndexForSuggestionsCommandInput,
  SearchPlaceIndexForTextCommandInput,
} from "@aws-sdk/client-location";
import {
  GetPlaceCommand,
  LocationClient,
  SearchPlaceIndexForSuggestionsCommand,
  SearchPlaceIndexForTextCommand,
} from "@aws-sdk/client-location";
import { withAPIKey } from "@aws/amazon-location-utilities-auth-helper";

export const getLocationDetailsFromPlaceId = async (placeId: string) => {
  const authHelper = await withAPIKey(process.env.AWS_LOCATION_API_KEY!);

  const client = new LocationClient({
    region: process.env.AWS_REGION!,
    ...authHelper.getLocationClientConfig(),
  });

  const input: GetPlaceCommandInput = {
    IndexName: "UsEastPlaceIndex",
    PlaceId: placeId,
  };

  const command = new GetPlaceCommand(input);
  const response = await client.send(command);
  const details = response.Place;
  if (!details?.Geometry?.Point) {
    throw new Error("No long/lat coordinates.");
  }

  return {
    longitude: details.Geometry.Point[0]!,
    latitude: details.Geometry.Point[1]!,
    line1: details.Label ?? "",
    line2: details.AddressNumber ?? "",
    city: details.Municipality ?? "",
    state: details.Region ?? "",
    zipCode: details.PostalCode ?? "",
  };
};

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

export const getAddressSuggestions = async (address: string) => {
  const authHelper = await withAPIKey(process.env.AWS_LOCATION_SUGGESTION_KEY!);
  const client = new LocationClient({
    region: process.env.AWS_REGION!,
    ...authHelper.getLocationClientConfig(),
  });

  const params: SearchPlaceIndexForSuggestionsCommandInput = {
    IndexName: "SuggestionIndex",
    Text: address,
    FilterCategories: ["AddressType"],
    FilterCountries: ["USA"],
    MaxResults: 5,
  };

  const command = new SearchPlaceIndexForSuggestionsCommand(params);
  const response = await client.send(command);

  if (!response.Results) {
    throw new Error("Invalid address.");
  }

  return response.Results;
};
