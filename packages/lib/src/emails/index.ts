import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SES } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";

import EmailVerificationCode from "./templates/email-verification-code";
import ResetPassword from "./templates/reset-password";
import WaitlistConfirmation from "./templates/waitlist-confirmation";

const ses = new SES({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_MAIL_SECRET_KEY!,
    accessKeyId: process.env.AWS_MAIL_ACCESS_KEY!,
  },
});

export const sendEmailVerificationEmail = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const emailHtml = render(EmailVerificationCode({ code }));

  const params: SendEmailCommandInput = {
    Source: "no-reply@millennicare.com",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: { Charset: "UTF-8", Data: emailHtml },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Email Verification Code",
      },
    },
  };

  const res = await ses.sendEmail(params);
  console.log(res);
};

export const sendPasswordResetEmail = async ({
  token,
  to,
}: {
  token: string;
  to: string;
}) => {
  const emailHtml = render(ResetPassword({ token }));

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

export const sendWaitlistConfirmationEmail = async ({
  email,
}: {
  email: string;
}) => {
  const emailHtml = render(WaitlistConfirmation());

  const params: SendEmailCommandInput = {
    Source: "no-reply@millennicare.com",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: { Charset: "UTF-8", Data: emailHtml },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Waitlist Confirmation",
      },
    },
  };

  return ses.sendEmail(params);
};
