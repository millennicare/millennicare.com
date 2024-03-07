import { Heading, Html, Tailwind } from "@react-email/components";

export default function WaitlistConfirmation() {
  return (
    <Tailwind>
      <Html className="flex items-center justify-center text-center">
        <Heading>MillenniCare</Heading>
        <p>
          <strong>Hi there!</strong>
        </p>
        <p>
          Thank you for joining the waitlist for MillenniCare. We're excited to
          have you on board and will be in touch soon.
        </p>
      </Html>
    </Tailwind>
  );
}
