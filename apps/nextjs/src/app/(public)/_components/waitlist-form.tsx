"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { z } from "zod";

import { Button } from "@millennicare/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@millennicare/ui/dialog";
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
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(submitWaitlist, {
    message: undefined,
    status: "warn",
  });

  const form = useForm({
    schema,
  });

  if (state.message) {
    if (state.message === "Invalid email address") {
      toast.warning(state.message);
    } else if (state.message === "Joined waitlist! 🎉") {
      toast.success(state.message);
      setOpen(false);
    } else {
      toast.error(state.message);
    }
    state.message = undefined;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="text-lg text-background">
          Join the Waitlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the waitlist</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
