"use client";

import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { Check } from "lucide-react";

import { cn } from "@millennicare/ui";
import { Button } from "@millennicare/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
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

import type { Address } from "../slices/address-slice";
import { SubmitButton } from "~/app/_components/submit-btn";
import useDebounce from "~/app/hooks/useDebounce";
import { getSuggestion } from "../../actions";
import { addressSchema } from "../slices/address-slice";
import useFormStore from "../useFormStore";

export default function AddressForm() {
  const { step, decreaseStep, increaseStep, address, setAddress } =
    useFormStore((state) => state);
  const form = useForm({
    schema: addressSchema,
    defaultValues: { ...address },
  });

  const line1 = form.watch("line1");
  const debouncedLine1 = useDebounce(line1, 1200);

  const { data, refetch, isError, isRefetching } = useQuery({
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

  useEffect(() => {
    // create a list of sugestions and inject them into the select component
    console.log(data);
  }, [data, isRefetching]);

  // function to clean up data and inject values into the correct fields
  function formatAddress(awsAddress: string) {
    const elements = awsAddress.split(",");
    console.log(elements);
  }

  function onSubmit(values: Address) {
    console.log(values);
    setAddress(values);
    increaseStep(step);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 px-3"
      >
        <Command>
          <FormField
            control={form.control}
            name="line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CommandList
            className={cn(data?.length === 0 ? "h-0 border-none" : "border")}
          >
            <CommandGroup>
              {data?.map((item) => (
                <CommandItem
                  key={item.PlaceId}
                  onClick={() => formatAddress(item.Text!)}
                >
                  <div className="flex items-center space-x-2">
                    <Check size={16} />
                    <span>{item.Text}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartment/Unit (optional)</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
