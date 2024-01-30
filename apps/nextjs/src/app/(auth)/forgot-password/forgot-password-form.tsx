"use client";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
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
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await sendResetPasswordEmail(values.email);
      console.log(response);
      toast.success(response.message);
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
                <FormDescription>
                  Enter the email address associated with your account and we'll
                  send you an email with instructions to reset your password.
                </FormDescription>
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
    </div>
  );
}
