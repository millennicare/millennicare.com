"use client";

import { useFormState } from "react-dom";
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

import { SubmitButton } from "~/app/_components/submit-btn";
import { submitWaitlist } from "../actions";

const schema = z.object({
  email: z.string().email(),
});

export default function WaitlistForm() {
  const [message, formAction] = useFormState(submitWaitlist, null);
  const form = useForm({
    schema,
  });

  if (message !== null) {
    if (message === "Invalid email address") {
      toast.warning(message);
      return;
    } else if (message === "Joined waitlist! 🎉") {
      toast.success(message);
      return;
    } else {
      toast.error(message);
      return;
    }
  }

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton value="Join waitlist" />
      </form>
    </Form>
  );
}
