import { NextResponse } from "next/server";
import { Resend } from "resend";

import { EmailTemplate } from "~/app/_components/email-template";
import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "MillenniCare <support@millennicare.com>",
      subject: "Hello world!",
      to: ["stevenarce@millennicare.com", "derickpineda@millennicare.com"],
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });

    if (error) {
      return NextResponse.json({ error });
    }

    return NextResponse.json({ data });
  } catch (error) {}
}
