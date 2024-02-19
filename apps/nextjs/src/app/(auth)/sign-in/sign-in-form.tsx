"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { z } from "zod";

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

import { SubmitButton } from "~/app/_components/submit-btn";
import { signIn } from "./actions";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function SignInForm() {
  const [state, formAction] = useFormState(signIn, {
    message: "",
    error: undefined,
  });

  const form = useForm({
    schema: formSchema,
  });

  if (state.error !== undefined) {
    if (state.error) {
      toast.error(state.message);
    } else {
      toast.success(state.message);
    }
    // clear error messages
    state.error = undefined;
    state.message = "";
  }

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
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign in with
              </span>
            </div>
          </div>
          <Button className="w-full" type="button" asChild>
            <Link href="/sign-in/google">
              <Icons.google className="mr-3 h-4 w-4" />
              Google
            </Link>
          </Button>
          */}
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
