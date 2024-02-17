"use client";

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

import type { Password } from "../slices/password-slice";
import { SubmitButton } from "~/app/_components/submit-btn";
import { passwordSchema } from "../slices/password-slice";
import useFormStore from "../useFormStore";

export default function PasswordForm() {
  const { step, increaseStep, decreaseStep, password, setPassword } =
    useFormStore((state) => state);

  const form = useForm({
    schema: passwordSchema,
    defaultValues: { ...password },
  });

  async function onSubmit(values: Password) {
    setPassword(values);
    increaseStep(step);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 px-3"
      >
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
              <FormLabel>Confirm</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col space-x-0 space-y-3 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button
            onClick={() => decreaseStep(step)}
            type="button"
            variant="outline"
            className="w-full"
          >
            Back
          </Button>
          <SubmitButton
            className="w-full"
            value="Next"
            error={!form.formState.errors}
          />
        </div>
      </form>
    </Form>
  );
}
