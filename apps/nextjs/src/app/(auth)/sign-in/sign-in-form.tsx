"use client";

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
import { login } from "../actions";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export default function SignInForm() {
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: FormData) {
    const values = Object.fromEntries(formData.entries()) as z.infer<
      typeof formSchema
    >;

    try {
      await login(values);
      toast.success("Going to dashboard!");
    } catch (error) {
      if (error instanceof TRPCError) {
        return toast.error(error.message);
      }
      toast.error("Something went wrong, please try again later.");
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

          <SubmitButton value="Sign In" className="text-white" />
        </form>
      </Form>

      <Button variant="link" className="text-black">
        Don't have an account?
      </Button>
    </div>
  );
}
