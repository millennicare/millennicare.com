"use client";

import Link from "next/link";
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
import { login } from "../actions";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email()
    .min(1, { message: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password is required" }),
});

export default function SignInForm() {
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(formData: FormData) {
    const values = Object.fromEntries(formData.entries()) as z.infer<
      typeof formSchema
    >;

    try {
      await login(values);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <Form {...form}>
        <form
          action={onSubmit}
          className="flex w-full max-w-md flex-col space-y-4 rounded-lg border px-4 py-2 md:w-1/2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            value="Sign In"
            className="text-white"
            error={!form.formState.isValid}
          />
        </form>
      </Form>

      <Button asChild variant="link" className="text-black">
        <Link href="/sign-up">Don&apos;t have an account?</Link>
      </Button>
    </div>
  );
}
