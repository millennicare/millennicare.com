"use client";

import { useState } from "react";
import Link from "next/link";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

import { SubmitButton } from "~/app/_components/submit-btn";
import { sendResetPasswordEmail } from "../actions";

const formSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await sendResetPasswordEmail(values.email);
      setEmailSent(true);
    } catch (error) {
      if (error instanceof TRPCError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else toast.error("Something went wrong, please try again later.");
    }
  }

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      {emailSent ? (
        <span className="flex w-full max-w-md flex-col space-y-4 rounded-lg border px-4 py-2 md:w-1/2">
          <p className="text-sm">
            An email is on it&apos;s way to {form.getValues("email")} with
            instructions to reset your password.
            <br />
            <br />
            If you don't receive an email soon, check that the email address you
            entered is correct, check your spam folder or reach out to support
            if the issue persists.
          </p>

          <Button asChild>
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </span>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-md flex-col space-y-4 rounded-lg border px-4 py-2 md:w-1/2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="example@email.com" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton
              value="Send reset instructions"
              className="w-full"
              error={!form.formState.errors}
            />
          </form>
        </Form>
      )}
    </div>
  );
}
