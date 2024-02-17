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

import type { AdditionalInfo } from "../slices/additional-info-slice";
import { SubmitButton } from "~/app/_components/submit-btn";
import { additionalInfoSchema } from "../slices/additional-info-slice";
import useFormStore from "../useFormStore";

export default function AdditionalInfoForm() {
  const {
    step,
    decreaseStep,
    increaseStep,
    additionalInfo,
    setAdditionalInfo,
  } = useFormStore((state) => state);

  const form = useForm({
    schema: additionalInfoSchema,
    defaultValues: { ...additionalInfo },
    mode: "onSubmit",
  });

  function onSubmit(values: AdditionalInfo) {
    setAdditionalInfo(values);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
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
