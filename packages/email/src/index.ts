import aws, { SESClient } from "@aws-sdk/client-ses";
import * as dotenv from "dotenv";
import { createTransport } from "nodemailer";

dotenv.config({
  path: "../../.env",
});

const client = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

const transporter = createTransport({
  SES: { client, aws },
});

transporter.sendMail(
  {
    from: "stevenarce@millennicare.com",
    to: "stevenmatthew.arce@gmail.com",
    subject: "Test subject",
    text: "hello world",
  },
  (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log(info.envelope);
  },
);
