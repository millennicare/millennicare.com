import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";

import ResetPasswordEmail from "./templates/reset-password";

const ses = new SES({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_MAIL_SECRET_KEY!,
    accessKeyId: process.env.AWS_MAIL_ACCESS_KEY!,
  },
});

type SendPasswordResetEmailParams = {
  token: string;
  to: string;
};

export const sendPasswordResetEmail = async ({
  token,
  to,
}: SendPasswordResetEmailParams) => {
  const emailHtml = render(ResetPasswordEmail({ token }));

  const params: SendEmailCommandInput = {
    Source: "no-reply@millennicare.com",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: { Charset: "UTF-8", Data: emailHtml },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Reset your password",
      },
    },
  };

  return ses.sendEmail(params);
};
