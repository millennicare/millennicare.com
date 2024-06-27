import { Heading, Html, Tailwind } from "@react-email/components";

interface EmailVerificationCodeProps {
  code: string;
}

export default function EmailVerificationCode({
  code,
}: EmailVerificationCodeProps) {
  return (
    <Tailwind>
      <Html className="flex items-center justify-center text-center">
        <Heading>MillenniCare</Heading>
        <p>
          <strong>Hi there!</strong>
        </p>
        <p>
          Your email verification code is <strong>{code}</strong>
        </p>
        <p>
          Please enter this code in the verification form to verify your email
          address.
        </p>
      </Html>
    </Tailwind>
  );
}
