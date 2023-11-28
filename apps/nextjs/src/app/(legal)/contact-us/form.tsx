"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

export default function ContactUsForm() {
  const contactSchema = z.object({
    email: z
      .string({
        required_error: "Email Required",
      })
      .email({ message: "Enter Valid Email" }),
    firstName: z
      .string({
        required_error: "First Name Required",
      })
      .min(2, { message: "Enter First Name" }),
    lastName: z
      .string({ required_error: "Last Name Required" })
      .min(2, { message: "Enter Last Name" }),
    phoneNumber: z
      .string()
      .refine(validator.isMobilePhone, { message: "Enter Valid Phone Number" })
      .optional()
      .or(z.literal("")),
    message: z
      .string({ required_error: "Please Enter Message" })
      .min(2, { message: "Enter Message" }),
  });

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      message: "",
    },
  });

  const handleContactSubmit = () => {};

  return (
    <Form {...contactForm}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={contactForm.handleSubmit(handleContactSubmit)}
      >
        {/* First Name */}
        <FormField
          control={contactForm.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={contactForm.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={contactForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={contactForm.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={contactForm.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormLabel>Fields marked with an asterisk (*) are required. </FormLabel>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
