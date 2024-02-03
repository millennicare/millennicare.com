"use client";

import { TRPCClientError } from "@trpc/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@millennicare/ui/select";

import type { CreatePaymentInput } from "../actions";
import { SubmitButton } from "~/app/_components/submit-btn";
import { createPayment } from "../actions";

interface Props {
  setOpenAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = z.object({
  type: z.literal("card"),
  card: z.object({
    number: z.string(),
    exp_month: z.string(),
    exp_year: z.string(),
    cvc: z.string(),
  }),
  billing_details: z.object({
    address: z.object({
      city: z.string(),
      country: z.string(),
      line1: z.string(),
      line2: z.string().optional(),
      postal_code: z.string(),
      state: z.string(),
    }),
    name: z.string(),
  }),
});

export default function AddPaymentMethodForm({ setOpenAddForm }: Props) {
  const form = useForm({
    schema,
    defaultValues: {
      type: "card",
      card: {
        number: "",
        exp_month: "",
        exp_year: "",
        cvc: "",
      },
      billing_details: {
        address: {
          city: "",
          country: "",
          line1: "",
          line2: "",
          postal_code: "",
          state: "",
        },
        name: "",
      },
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
    // transform values to CreatePaymentInput
    // try {
    //   await createPayment(values);
    // } catch (error) {
    //   console.error(error);
    //   if (error instanceof TRPCClientError) {
    //   }
    // }
  }

  return (
    <>
      <h1>Payment method</h1>
      <p className="text-sm text-muted-foreground">
        Add a new payment method to your account.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="billing_details.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="First Last" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="card.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <span className="flex w-full flex-col space-x-2 md:flex-row">
            <FormField
              control={form.control}
              name="card.exp_month"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Month</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">January</SelectItem>
                      <SelectItem value="2">February</SelectItem>
                      <SelectItem value="3">March</SelectItem>
                      <SelectItem value="4">April</SelectItem>
                      <SelectItem value="5">May</SelectItem>
                      <SelectItem value="6">June</SelectItem>
                      <SelectItem value="7">July</SelectItem>
                      <SelectItem value="8">August</SelectItem>
                      <SelectItem value="9">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="card.exp_year"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={`${new Date().getFullYear() + i}`}
                        >
                          {new Date().getFullYear() + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="card.cvc"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </span>

          <SubmitButton value="Save" error={!form.formState.errors} />
        </form>
      </Form>
    </>
  );
}
