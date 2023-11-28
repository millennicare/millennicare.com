import aws, { SESClient } from "@aws-sdk/client-ses";
import * as dotenv from "dotenv";
import { createTransport } from "nodemailer";

dotenv.config({
  path: "../../.env",
});

const client = new SESClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION as string,
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
