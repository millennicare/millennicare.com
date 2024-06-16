"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@millennicare/ui";
import { Button } from "@millennicare/ui/button";

interface SubmitButtonProps {
  value: string;
  className?: string;
  error?: boolean;
}

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
      className={cn(className, "text-background")}
    >
      {pending ? "Loading..." : value}
    </Button>
  );
};
