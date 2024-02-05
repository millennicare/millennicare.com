"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { cn } from "@millennicare/ui";
import { Button } from "@millennicare/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@millennicare/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@millennicare/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@millennicare/ui/select";
import { Separator } from "@millennicare/ui/separator";
import { toast } from "@millennicare/ui/toast";
import { paymentMethodInput, selectUserSchema } from "@millennicare/validators";

import { SubmitButton } from "~/app/_components/submit-btn";
import { createPayment } from "../actions";

interface Props {
  setOpenAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  user: z.infer<typeof selectUserSchema>;
}

const schema = paymentMethodInput.merge(
  z.object({
    card: z.object({
      exp_month: z.string(),
      exp_year: z.string(),
      number: z.string().length(16),
      cvc: z.string().length(3),
    }),
  }),
);

// create an array of objects that include the two letter country code and the country name as value and label
const countries = [{ value: "US", label: "United States" }];

export default function AddPaymentMethodForm({ setOpenAddForm, user }: Props) {
  const form = useForm({
    schema: schema,
    defaultValues: {
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
        name: `${user.firstName} ${user.lastName}`,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    // transform values to CreatePaymentInput
    const data = {
      billing_details: {
        ...values.billing_details,
        address: {
          ...values.billing_details.address,
          line2: values.billing_details.address.line2 ?? "",
        },
      },
      card: {
        ...values.card,
        exp_month: parseInt(values.card.exp_month),
        exp_year: parseInt(values.card.exp_year),
      },
    };

    try {
      await createPayment(data);
      toast.success("Payment method added successfully.");
      setOpenAddForm(false);
    } catch (error) {
      console.error(error);
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Something went wrong, please try again later.");
    }
  }

  return (
    <>
      <h1>Payment method</h1>
      <p className="text-sm text-muted-foreground">
        Add a new payment method to your account.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
          <span className="flex flex-col space-y-3 sm:flex-row sm:space-x-2 sm:space-y-0">
            <FormField
              control={form.control}
              name="card.exp_month"
              render={({ field }) => (
                <FormItem className="w-full sm:w-1/3">
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
                <FormItem className="w-full sm:w-1/3">
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
                <FormItem className="w-full sm:w-1/3">
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </span>
          <Separator />
          <h1>Billing Address</h1>
          <FormField
            control={form.control}
            name="billing_details.address.country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Country</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        size="sm"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? countries.find(
                              (country) => country.value === field.value,
                            )?.label
                          : "Select country"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                      />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            value={country.label}
                            key={country.value}
                            onSelect={() => {
                              form.setValue(
                                "billing_details.address.country",
                                country.value,
                              );
                            }}
                          >
                            {country.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                country.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billing_details.address.line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address line 1</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billing_details.address.line2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address line 2 (optional)</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billing_details.address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="flex flex-col space-y-3 md:flex-row md:space-x-2 md:space-y-0">
            <FormField
              control={form.control}
              name="billing_details.address.postal_code"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billing_details.address.state"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </span>
          <SubmitButton
            value="Save"
            className="w-full"
            error={!form.formState.errors}
          />
        </form>
      </Form>
    </>
  );
}
