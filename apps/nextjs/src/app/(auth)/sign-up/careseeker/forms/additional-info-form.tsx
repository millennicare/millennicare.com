"use client";

import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { z } from "zod";

import { cn } from "@millennicare/ui";
import { Button } from "@millennicare/ui/button";
import { Calendar } from "@millennicare/ui/calendar";
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

import { SubmitButton } from "~/app/_components/submit-btn";
import { getSuggestion } from "~/app/(auth)/actions";
import useFormStore from "../useFormStore";

const zipCodeReg = new RegExp(/^\b\d{5}(-\d{4})?\b$/);

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.any(),
  // profilePicture: z.union([
  //   z.string(),
  //   z.custom<File>((v) => v instanceof File),
  // ]),
  phoneNumber: z.string(),
  birthdate: z.date(),
  address: z.object({
    zipCode: z.string(),
  }),
});

export default function AdditionalInfoForm() {
  const [city, setCity] = useState("");
  const {
    childrenInfo,
    personalInfo,
    additionalInfo,
    setAdditionalInfo,
    decreaseStep,
  } = useFormStore((state) => state);

  const form = useForm({
    schema,
    defaultValues: { ...additionalInfo },
  });
  const watchZipCode = form.watch("address.zipCode");

  useEffect(() => {
    if (zipCodeReg.test(watchZipCode)) {
      getSuggestion(watchZipCode)
        .then((res) => {
          setCity(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [watchZipCode]);

  async function onSubmit(formValues: FormData) {
    console.log(childrenInfo);
    console.log(personalInfo);
    console.log(formValues);
  }

  return (
    <Form {...form}>
      <form className="space-y-2 px-4 py-2" action={onSubmit}>
        <span className="flex flex-col md:flex-row md:space-x-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </span>

        <span className="flex flex-col md:flex-row md:space-x-2">
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Birthdate</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        size="sm"
                        variant={"outline"}
                        className={cn(
                          "w-full text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="single"
                      captionLayout="dropdown-buttons"
                      selected={field.value}
                      onSelect={field.onChange}
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear() - 18}
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </span>

        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile picture</FormLabel>
              <FormControl>
                <Input
                  id="profilePicture"
                  {...field}
                  type="file"
                  accept="image/png, image/jpeg"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {city ? <p className="pt-0 text-sm italic">{city}</p> : <></>}

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => decreaseStep(3)}
            type="button"
          >
            Back
          </Button>
          <SubmitButton
            value="Submit"
            className="text-background"
            error={!form.formState.isValid}
          />
        </div>
      </form>
    </Form>
  );
}
