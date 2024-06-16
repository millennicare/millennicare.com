"use client";

import type { z } from "zod";

import type { User, UserInfo } from "@millennicare/validators";
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
  createUserInfoSchema,
  createUserSchema,
} from "@millennicare/validators";

import { SubmitButton } from "~/app/_components/submit-btn";

interface EditCareseekerFormProps {
  user: User;
  userInfo: UserInfo;
}

const schema = createUserSchema
  .pick({ email: true })
  .and(createUserInfoSchema.pick({ name: true }));

export default function EditCareseekerForm({
  user,
  userInfo,
}: EditCareseekerFormProps) {
  const form = useForm({
    schema,
    defaultValues: {
      name: userInfo.name,
      email: user.email,
    },
    mode: "onTouched",
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      console.log(values);
      // await updateCareseeker(values);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
