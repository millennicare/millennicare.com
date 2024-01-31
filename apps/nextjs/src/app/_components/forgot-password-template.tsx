import * as React from "react";

import { Button } from "@millennicare/ui/button";

type ForgotPasswordProps = {
  token: string;
};

export const ForgotPasswordTemplate: React.FC<
  Readonly<ForgotPasswordProps>
> = ({ token }) => {
  return (
    <div className="h-full w-full">
      <span className="flex items-center justify-center space-y-5 text-center">
        <img
          src="/millennicare_logo_with_text.svg"
          height={50}
          width={50}
          alt="MillenniCare logo"
        />
        <h1 className="">Trouble signing in?</h1>
        <p>
          Resetting your password is easy. Just click the button below and
          follow the instructions. We'll have you back into your account in no
          time.
        </p>

        <Button size="lg">
          <a href={`http://localhost:3000/reset-password/${token}`}>
            Reset your password
          </a>
        </Button>
      </span>
    </div>
  );
};
