"use server";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "~/env.mjs";

const Bucket = env.AWS_BUCKET;

const client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadImage(data: FormData) {
  if (!data.get("file")) return;
  const file = data.get("file") as File;
  const command = new PutObjectCommand({
    Key: file.name,
    Bucket,
  });

  const url = await getSignedUrl(client, command);
  return url;
}

async function getImage(key: string) {
  const command = new GetObjectCommand({
    Key: key,
    Bucket,
  });

  const url = await getSignedUrl(client, command);
  return url;
}

export { uploadImage, getImage };
