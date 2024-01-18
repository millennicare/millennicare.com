"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@millennicare/ui/button";

type SubmitButtonProps = {
  value: string;
  className?: string;
  error?: boolean;
};

export const SubmitButton = ({
  value,
  className,
  error,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      value={pending ? "Loading..." : value}
      disabled={pending || error}
      className={className}
    >
      {pending ? "Loading..." : value}
    </Button>
  );
};
