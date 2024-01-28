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
import { createUserSchema } from "@millennicare/validators";

import type { PersonalInfo } from "../slices/personal-info-slice";
import { SubmitButton } from "~/app/_components/submit-btn";
import { checkDuplicateEmail } from "~/app/(auth)/actions";
import useFormStore from "../useFormStore";

const formSchema = createUserSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export default function PersonalInfoForm() {
  const { personalInfo, setPersonalInfo, increaseStep } = useFormStore(
    (state) => state,
  );

  const form = useForm({
    schema: formSchema,
    defaultValues: { ...personalInfo, confirm: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: PersonalInfo) {
    try {
      await checkDuplicateEmail(values.email);
      setPersonalInfo({ ...personalInfo, ...values });
      increaseStep(1);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      toast.error("Something went wrong, please try again later.");
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-2 px-4 py-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
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
              <FormLabel>Password</FormLabel>
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <span className="flex justify-end">
          <SubmitButton
            value="Next"
            error={!form.formState.isValid}
            className="text-background"
          />
        </span>
      </form>
    </Form>
  );
}
