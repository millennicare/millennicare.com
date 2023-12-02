import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getLocationSuggestion } from "@millennicare/lib";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      zipCode: string;
    };
    if (body.zipCode.length !== 5) {
      return NextResponse.json({ status: 400, message: "Invalid zip code" });
    }

    const response = await getLocationSuggestion(body.zipCode);

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Error" });
  }
}
