import type {
  DeleteObjectRequest,
  GetObjectCommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.AWS_BUCKET!;

export const uploadFile = async (
  file: Buffer,
  fileName: string,
  type: string,
) => {
  const key = `${Date.now()}-${fileName}`;
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: type,
  };

  const command = new PutObjectCommand(params);
  await client.send(command);
  return key;
};

export const getPresignedUrl = async (key: string) => {
  const params: GetObjectCommandInput = {
    Bucket: bucket,
    Key: key,
  };

  const getCommand = new GetObjectCommand(params);
  const url = await getSignedUrl(client, getCommand);
  return url;
};

// used when a user deletes their account
export const deleteObject = async (key: string) => {
  const input: DeleteObjectRequest = {
    Bucket: process.env.AWS_BUCKET!,
    Key: key,
  };

  const command = new DeleteObjectCommand(input);

  const response = await client.send(command);
  return response;
};
