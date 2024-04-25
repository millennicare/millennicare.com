"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@millennicare/ui";
import { buttonVariants } from "@millennicare/ui/button";
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
import { useFormState } from "react-dom";
import { z } from "zod";

import type { ActionResult } from "~/app/@types/action-result";
import { SubmitButton } from "~/app/_components/submit-btn";

type SignInFormProps = {
  signIn: (_: any, formData: FormData) => Promise<ActionResult>;
};

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function SignInForm({ signIn }: SignInFormProps) {
  const [state, formAction] = useFormState(signIn, {
    error: null,
  });

  const form = useForm({
    schema: formSchema,
  });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <div className="flex w-full max-w-md flex-col space-y-4 md:w-1/2">
      <Form {...form}>
        <form action={formAction} className="space-y-3 rounded-lg border p-3">
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
                <FormLabel className="flex items-center justify-between">
                  Password
                  <Link
                    href="/forgot-password"
                    className={cn(buttonVariants({ variant: "link" }))}
                  >
                    Forgot?
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            value="Sign in"
            className="w-full"
            error={!form.formState.isValid}
          />
        </form>
      </Form>

      <span className="flex items-center justify-center space-y-6 rounded-lg border p-3">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            prefetch={false}
            href="/sign-up"
            className={cn(buttonVariants({ variant: "link" }), "p-0")}
          >
            Sign up.
          </Link>
        </p>
      </span>
    </div>
  );
}
