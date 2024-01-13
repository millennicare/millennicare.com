"use client";

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
import { Textarea } from "@millennicare/ui/textarea";
import { toast } from "@millennicare/ui/toast";
import { CreateContactSchema } from "@millennicare/validators";

import { SubmitButton } from "~/app/_components/submit-btn";

interface ContactUsFormProps {
  create: (values: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    message: string;
  }) => Promise<void>;
}

export default function ContactUsForm({ create }: ContactUsFormProps) {
  const form = useForm({
    schema: CreateContactSchema,
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: undefined,
      message: "",
    },
  });

  async function handleSubmit(formData: FormData) {
    const values = Object.fromEntries(formData.entries()) as z.infer<
      typeof CreateContactSchema
    >;

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
        className="flex flex-col space-y-4 rounded bg-background p-10 shadow-md"
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

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (optional)</FormLabel>
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

        <SubmitButton value="Submit" className="text-background" />
      </form>
    </Form>
  );
}
