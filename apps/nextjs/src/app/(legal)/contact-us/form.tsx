"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import validator from "validator";
import * as z from "zod";

import { Button } from "~/components/ui/button";
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
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export default function ContactUsForm() {
  const sendContactUsMessage = api.contactUs.sendMessage.useMutation();
  const { toast } = useToast();
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
      phoneNumber: undefined,
      message: "",
    },
  });

  const handleContactSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
      await sendContactUsMessage.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        message: values.message,
      });

      toast({
        title: "We received your message!",
        variant: "default",
      });

      contactForm.reset();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...contactForm}>
      <form
        className="bg-background flex flex-col space-y-4 rounded p-10 shadow-md"
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
