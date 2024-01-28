"use client";

import type { z } from "zod";
import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import type { createCareseekerSchema } from "@millennicare/validators";
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
import { toast } from "@millennicare/ui/toast";

import type { AdditionalInfo } from "../slices/additional-info-slice";
import { SubmitButton } from "~/app/_components/submit-btn";
import {
  careseekerRegister,
  getSuggestion,
  uploadFileToS3,
} from "~/app/(auth)/actions";
import { additionalInfoSchema } from "../slices/additional-info-slice";
import useFormStore from "../useFormStore";

const zipCodeReg = new RegExp(/^\b\d{5}(-\d{4})?\b$/);

export default function AdditionalInfoForm() {
  const [city, setCity] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { childrenInfo, personalInfo, additionalInfo, decreaseStep } =
    useFormStore((state) => state);

  const form = useForm({
    schema: additionalInfoSchema,
    defaultValues: { ...additionalInfo, userType: "careseeker" },
    mode: "onBlur",
  });
  const watchZipCode = form.watch("address.zipCode");

  useEffect(() => {
    if (form.formState.errors) {
      console.log(form.formState.errors);
    }
  }, [form.formState.errors]);

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

  async function onSubmit(values: AdditionalInfo) {
    console.log(childrenInfo);
    console.log(values);
    try {
      let profileLink: string | undefined = undefined;
      if (file) {
        const data = new FormData();
        data.append("file", file);
        const res = await uploadFileToS3(data);
        console.log(res);
        profileLink = res;
      }

      const careseekerValues: z.infer<typeof createCareseekerSchema> = {
        ...personalInfo,
        children: Array.isArray(childrenInfo.children)
          ? childrenInfo.children
          : Object.values(childrenInfo.children),
        ...values,
        profilePicture: profileLink,
        userType: "careseeker",
      };

      await careseekerRegister(careseekerValues);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-2 px-4 py-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear() - 18}
                      captionLayout="dropdown-buttons"
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
          render={() => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files?.item(0) !== undefined) {
                      setFile(files[0] ?? null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
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
            value="Finish"
            className="text-background"
            error={!form.formState.isValid}
          />
        </div>
      </form>
    </Form>
  );
}
