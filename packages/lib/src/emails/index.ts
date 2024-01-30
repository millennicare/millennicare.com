import { Resend } from "resend";

import ResetPasswordEmail from "./templates/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

type ResetPasswordEmailProps = {
  to: string;
  token: string;
};

export const sendResetPasswordEmail = async (
  values: ResetPasswordEmailProps,
) => {
  const { error } = await resend.emails.send({
    to: values.to,
    from: "MillenniCare <no-reply@millennicare.com>",
    subject: "Reset your MillenniCare password",
    react: ResetPasswordEmail({ token: values.token }),
  });

  if (error) {
    throw new Error(error.message);
  }
};
