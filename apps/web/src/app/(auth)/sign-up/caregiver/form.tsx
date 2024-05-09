"use client";

import type { z } from "zod";
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
import { createUserSchema } from "@millennicare/validators";

import { SubmitButton } from "~/app/_components/submit-btn";
import { caregiverRegister } from "./actions";

export default function RegisterForm() {
  const form = useForm({
    schema: createUserSchema,
    defaultValues: {
      type: "caregiver",
    },
  });

  async function onSubmit(values: z.infer<typeof createUserSchema>) {
    try {
      await caregiverRegister(values);
      toast.success("Caregiver account created successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("An error occurred");
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col space-y-4 md:w-1/2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 rounded-lg border p-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
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
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton
            value="Sign up"
            className="w-full"
            // error={!form.formState.isValid}
          />
        </form>
      </Form>
    </div>
  );
}
