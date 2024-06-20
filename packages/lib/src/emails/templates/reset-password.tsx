import { Button, Heading, Html, Tailwind } from "@react-email/components";

interface ResetPasswordProps {
  token: string;
}

export default function ResetPassword({ token }: ResetPasswordProps) {
  function getLink() {
    let link;

    if (process.env.NODE_ENV === "production") {
      link = "https://millennicare.com";
    } else if (process.env.NODE_ENV === "test") {
      link = "https://millennicarecom-development.up.railway.app";
    } else link = "http://localhost:3000";
    return `${link}/auth/reset-password/${token}`;
  }

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
      <Html className="flex items-center justify-center text-center">
        <Heading>Can't login?</Heading>
        <p>Click the link below and reset your password</p>
        <Button
          href={getLink()}
          target="_blank"
          className="bg-brand rounded-md px-4 py-2 text-white"
        >
          Reset password
        </Button>
      </Html>
    </Tailwind>
  );
}
