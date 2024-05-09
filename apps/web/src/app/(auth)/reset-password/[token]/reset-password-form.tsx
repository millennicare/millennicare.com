"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@millennicare/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@millennicare/ui/form";
import { Input } from "@millennicare/ui/input";
import { toast } from "@millennicare/ui/toast";
import { z } from "zod";

import { SubmitButton } from "~/app/_components/submit-btn";
import { resetPassword } from "./actions";

const passwordSchema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,32}$/, // eslint-disable-line
        {
          message:
            "Password must be minimum 8 characters and at least one uppercase letter, one lowercase letter, and one number.",
        },
      )
      .min(8, { message: "Password must be between 8 and 32 characters." })
      .max(32, { message: "Password must be between 8 and 32 characters." }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export default function ResetPasswordForm() {
  const [passwordReset, setPasswordReset] = useState(false);
  const params = useParams<{ token: string }>();
  const form = useForm({
    schema: passwordSchema,
  });

  if (!params.token) {
    throw new Error("Reset password token is required");
  }

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    try {
      await resetPassword(values.password, params.token);
      setPasswordReset(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      {passwordReset ? (
        <div className="flex w-full max-w-md flex-col space-y-4 rounded-lg border px-4 py-2 md:w-1/2">
          <h2 className="text-xl font-semibold">Password reset</h2>
          <p className="text-sm">
            Your password has been reset. You can now login with your new
            password.
          </p>
          <Button asChild>
            <Link href="/sign-in">Back to login</Link>
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-md flex-col space-y-4 rounded-lg border px-4 py-2 md:w-1/2"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton
              value="Reset password"
              className="w-full"
              error={!form.formState.errors}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
