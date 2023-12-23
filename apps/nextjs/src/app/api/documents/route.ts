import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { getPresignedUrl, uploadFile } from "@millennicare/lib";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const mimeType = file.type;
    const fileExtension = mimeType.split("/")[1];

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = await uploadFile(
      buffer,
      uuid() + "." + fileExtension,
      mimeType,
    );

    return NextResponse.json({ status: 201, fileKey });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      error: "Error uploading image",
    });
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }
  const url = await getPresignedUrl(key);
  return NextResponse.json({ url });
}
