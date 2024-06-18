"use client";

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
import { toast } from "@millennicare/ui/toast";

import { SubmitButton } from "~/app/_components/submit-btn";
import { updatePassword } from "../actions";

const schema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
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
  .refine((data) => data.newPassword === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });

export default function UpdateSecurityForm() {
  const form = useForm({
    schema,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirm: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const { newPassword, currentPassword } = values;
    const response = await updatePassword({ newPassword, currentPassword });

    if (response.success) {
      toast.success(response.message);
      return;
    }

    toast.error(response.message);
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
              <FormLabel>Confirm</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <SubmitButton
            value="Update"
            className="text-background"
            error={!form.formState.errors}
          />
        </div>
      </form>
    </Form>
  );
}
