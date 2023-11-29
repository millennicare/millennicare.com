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

const formSchema = z.object({
  code: z.string().min(6).max(6),
});

interface IVerifyFormProps extends FormProps {
  userIdRef: React.MutableRefObject<string>;
}

export default function VerifyForm({
  handleNext,
  formValues,
  userIdRef,
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

      const userId = completeSignUp.createdUserId;
      if (userId) {
        console.log(userId);
        userIdRef.current = userId;
      }

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        console.log("sign up completed, going back to parent form");
        await setActive({ session: completeSignUp.createdSessionId });
        handleNext();
      }
    } catch (error) {
      console.error("Error:", JSON.stringify(error, null, 2));
    }
  }

  return (
    <Form {...form}>
      <div className="text-center">
        <p className="text-sm">
          We&apos;ve sent an email to{" "}
          <span className="font-medium">{formValues.email}</span>.
        </p>
        <p className="text-sm">
          Please verify your email by entering the code you received.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(handleVerify)}
        className="mt-4 flex flex-col justify-center space-y-4"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter 6 digit code</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button variant="outline">Resend email</Button>
          <Button type="submit">Verify</Button>
        </div>
      </form>
    </Form>
  );
}
