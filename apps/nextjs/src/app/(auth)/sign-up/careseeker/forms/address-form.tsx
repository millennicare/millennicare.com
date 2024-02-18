"use client";

import { useCallback, useEffect, useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";

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
import { ScrollArea } from "@millennicare/ui/scroll-area";

import type { Address } from "../slices/address-slice";
import { SubmitButton } from "~/app/_components/submit-btn";
import useDebounce from "~/app/hooks/useDebounce";
import { getSuggestion } from "../../actions";
import { addressSchema } from "../slices/address-slice";
import useFormStore from "../useFormStore";

const states = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];

export default function AddressForm() {
  const [open, setOpen] = useState(false);
  const { step, decreaseStep, increaseStep, address, setAddress } =
    useFormStore((state) => state);
  const form = useForm({
    schema: addressSchema,
    defaultValues: { ...address },
  });

  const line1 = form.watch("line1");
  const debouncedLine1 = useDebounce(line1, 1200);

  const { data, refetch } = useQuery({
    queryKey: ["address_results", debouncedLine1],
    queryFn: async () => {
      return await getSuggestion(debouncedLine1);
    },
    refetchOnWindowFocus: false,
    enabled: debouncedLine1.length > 1,
  });

  const debouncedRefetch = useCallback(
    debounce(() => refetch(), 1000), // 1000ms delay
    [], // dependencies array is empty because refetch and debounce do not change
  );

  useEffect(() => {
    debouncedRefetch();
    // Cleanup function to cancel the debounce on unmount
    return () => debouncedRefetch.cancel();
  }, [debouncedLine1, debouncedRefetch]);

  // function to clean up data and inject values into the correct fields
  function formatAddress(awsAddress: string, placeId: string) {
    const elements = awsAddress.split(",").map((item) => item.trim());
    // assign these elements to the values in the form and populate the form
    form.setValue("line1", elements[0]!);
    form.setValue("city", elements[1]!);
    form.setValue("state", elements[2]?.toUpperCase()!);
    form.setValue("zipCode", elements[3]!);
    form.setValue("placeId", placeId);
  }

  function onSubmit(values: Address) {
    setAddress(values);
    increaseStep(step);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap space-y-4 px-3"
      >
        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Street</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      size="sm"
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value.length > 0
                        ? field.value
                        : "Select an address"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px]">
                  <Command>
                    <FormField
                      control={form.control}
                      name="line1"
                      render={({ field }) => (
                        <FormItem className="h-9">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ScrollArea className="h-32">
                      <CommandEmpty>No address found.</CommandEmpty>
                      <CommandGroup>
                        {data?.map((address) => (
                          <CommandItem
                            value={address.Text}
                            key={address.PlaceId}
                            onSelect={() => {
                              formatAddress(address.Text!, address.PlaceId!);
                            }}
                          >
                            {address.Text}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Apartment/Unit (optional)</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col space-x-0 space-y-3 sm:flex-row sm:space-x-2 sm:space-y-0">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>State</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        size="sm"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? states.find((state) => state.value === field.value)
                              ?.label
                          : "Select state..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search state..."
                        className="h-9"
                      />
                      <ScrollArea className="h-32">
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {states.map((state) => (
                            <CommandItem
                              value={state.label}
                              key={state.value}
                              onSelect={() => {
                                form.setValue("state", state.value);
                              }}
                            >
                              {state.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  state.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Zip code</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col space-x-0 space-y-3 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button
            onClick={() => decreaseStep(step)}
            type="button"
            variant="outline"
            className="w-full"
          >
            Back
          </Button>
          <SubmitButton
            className="w-full"
            value="Next"
            error={!form.formState.errors}
          />
        </div>
      </form>
    </Form>
  );
}
