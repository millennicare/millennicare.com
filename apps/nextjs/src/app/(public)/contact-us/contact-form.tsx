"use client";

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
import { Textarea } from "@millennicare/ui/textarea";
import { toast } from "@millennicare/ui/toast";
import { createContactSchema } from "@millennicare/validators";

import { SubmitButton } from "~/app/_components/submit-btn";

interface ContactUsFormProps {
  create: (values: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  }) => Promise<void>;
}

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  message: "",
};

export default function ContactUsForm({ create }: ContactUsFormProps) {
  const form = useForm({
    schema: createContactSchema,
    defaultValues: initialState,
    mode: "onSubmit",
  });

  async function handleSubmit(formData: FormData) {
    const values = Object.fromEntries(
      formData.entries(),
    ) as typeof initialState;

    try {
      await create(values);
      toast.success("Message sent!");
    } catch (error) {
      toast.error("Something went wrong, please try again later.");
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4 rounded border p-10"
        action={handleSubmit}
      >
        {/* First Name */}
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

        {/* Last Name */}
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

        {/* Email */}
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

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          value="Submit"
          className="text-background"
          error={!form.formState.isValid}
        />
      </form>
    </Form>
  );
}
