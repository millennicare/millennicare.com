import { Button, Heading, Html, Tailwind } from "@react-email/components";

interface ResetPasswordEmailProps {
  token: string;
}

export default function ResetPasswordEmail({ token }: ResetPasswordEmailProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#B46EA4",
            },
          },
        },
      }}
    >
      <Html className="flex items-center justify-center bg-gray-400 text-center">
        <Heading>Can't login?</Heading>
        <p>Click the link below and reset your password</p>
        <Button
          href={`${process.env.NODE_ENV === "production" ? "https://millennicare.com" : "http://localhost:3000"}/reset-password/${token}`}
          target="_blank"
          className="bg-brand rounded-md px-4 py-2 text-white"
        >
          Reset password
        </Button>
      </Html>
    </Tailwind>
  );
}