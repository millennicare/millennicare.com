import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

import { env } from "~/env.mjs";

const client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
  },
});

async function uploadImageToS3(
  file: Buffer,
  fileName: string,
  type: string,
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: env.AWS_BUCKET,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: type,
  };

  const command = new PutObjectCommand(params);
  await client.send(command);

  const getCommand = new GetObjectCommand(params);
  const url = await getSignedUrl(client, getCommand);

  return url;
}

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
    const url = await uploadImageToS3(
      buffer,
      uuid() + "." + fileExtension,
      mimeType,
    );

    return NextResponse.json({ success: true, url });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error uploading image",
    });
  }
}
