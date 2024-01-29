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
import {
  createCareseekerSchema,
  selectCareseekerSchema,
  selectUserSchema,
} from "@millennicare/validators";

import { SubmitButton } from "~/app/_components/submit-btn";
import { updateCareseeker } from "../actions";

type EditCareseekerFormProps = {
  user: z.infer<typeof selectUserSchema>;
  careseeker: z.infer<typeof selectCareseekerSchema>;
};

const schema = createCareseekerSchema.pick({
  email: true,
  firstName: true,
  lastName: true,
});

export default function EditCareseekerForm({
  user,
  careseeker,
}: EditCareseekerFormProps) {
  const form = useForm({
    schema,
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    mode: "onTouched",
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await updateCareseeker(values);
      toast.success("Changes saved!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} />
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
