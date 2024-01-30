"use client";

import { useParams } from "next/navigation";
import { z } from "zod";

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
import { createUserSchema } from "@millennicare/validators";

import { SubmitButton } from "~/app/_components/submit-btn";

const schema = createUserSchema
  .pick({
    password: true,
  })
  .extend({ confirm: z.string() })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export default function ResetPasswordForm() {
  const params = useParams<{ token: string }>();
  const form = useForm({
    schema,
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  console.log(params);

  async function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
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
    </div>
  );

  if (!params.token) {
    throw new Error("Reset password token is required");
  }
}
