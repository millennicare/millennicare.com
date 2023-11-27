"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import type { FormProps } from "../types";

interface IVerifyFormProps extends FormProps {
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

const formSchema = z.object({
  code: z.string().min(6).max(6),
});

export default function VerifyForm({
  handleNext,
  setUserId,
  formValues,
}: IVerifyFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
    mode: "all",
  });

  async function handleVerify(values: z.infer<typeof formSchema>) {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        console.log("sign up completed, going back to parent form");
        await setActive({ session: completeSignUp.createdSessionId });
      }

      const userId = completeSignUp.createdUserId;

      if (!userId) {
        console.log("user id not created");
        return;
      }
      setUserId(userId);
      handleNext();
    } catch (error) {
      console.error("Error:", JSON.stringify(error, null, 2));
    }
  }
  return (
    <Form {...form}>
      <p>
        We`ve sent an email to ${formValues.email}. Please verify your email by
        entering the code you received.
      </p>
      <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Enter 6 digit code</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Verify</Button>
      </form>
    </Form>
  );
}
