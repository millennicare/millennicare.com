import { type NextRequest, NextResponse } from "next/server";
import {
  LocationClient,
  SearchPlaceIndexForTextCommand,
} from "@aws-sdk/client-location";
import { withAPIKey } from "@aws/amazon-location-utilities-auth-helper";

const apiKey =
  "v1.public.eyJqdGkiOiI5NjlhZGZmMC05YWYyLTQxOTItYjg2OS0zNTBhN2Y3MDk0MzUifZFF3tXQHxTTifVvKmo6vf87eshKUBy6trOZp8K96x5rk07rQgPAKDaHISPtusPBMTIk2fImp5uRJMwws8YDZe6nhs2kmNcptL05UXJrJoHl1bL27kVOKGozB_jAFUoQUiixCz0rIyUxLbskWXU1kgnre_XZJVVTcWNQub-XhMBz-zUEzVFkaxbgIimVq2B_EvVrcEYtqjZuO8k5TWrzrglezO_-uZEYP4rh6kkIZgq-r21mToCd8V5F6Qw5VzH-Vu93CEruJ5BRxaauO3oCocJJevnJs6bSyvzkbFLKZhxRhv7COJnR7JIeghPSG5wnNEk9YgyrviiXuM2vOKWfWMk.ZWU0ZWIzMTktMWRhNi00Mzg0LTllMzYtNzlmMDU3MjRmYTkx"

const authHelper = await withAPIKey(apiKey);

const client = new LocationClient({
  region: "us-east-1",
  ...authHelper.getLocationClientConfig(),
});

export async function POST(request: NextRequest) {
  try {
    const body: { locationId: string } = await request.json();
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
