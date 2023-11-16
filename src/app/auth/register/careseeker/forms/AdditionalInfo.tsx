"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import format from "date-fns/format";

import { cn } from "~/lib/utils";
import type { FormProps } from "../page";
import { Calendar } from "~/components/ui/calendar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";

const zipCodeReg = /^\b\d{5}(-\d{4})?\b$/;

const formSchema = z.object({
  profilePicture: z.any(),
  birthdate: z.coerce.date(),
  biography: z.string().optional(),
  locationId: z
    .string({ required_error: "Zip Code Required" })
    .regex(new RegExp(zipCodeReg)),
});

export default function AdditionalInfoForm({
  formValues,
  setFormValues,
  handleBack,
  handleNext,
  step,
}: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
    mode: "onSubmit",
  });
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  async function handleSave(values: z.infer<typeof formSchema>) {
    let locationId = "";
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        body: JSON.stringify(values.locationId),
      });

      console.log(res);

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: "Please enter a valid zip code.",
        });
        return;
      }

      const json = (await res.json()) as {
        locationId: string;
      };
      locationId = json.locationId;
      console.log(locationId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "Error fetching location details.",
      });
    }

    setUploading(true);
    let profileLink: string | undefined = undefined;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });

        const json = (await response.json()) as {
          url: string;
        };
        profileLink = json.url;
      } catch (error) {
        console.error(error);
      }

      setUploading(false);
      setFile(null);
    }

    setFormValues((prev) => ({
      ...prev,
      ...values,
      profilePicture: profileLink,
      locationId: locationId,
    }));

    console.log(formValues);
    handleNext();
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profilePicture"
          render={() => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  // {...field}
                  type="file"
                  accept="image*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files[0]) setFile(files[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem className="mt-5">
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
          >
            Back
          </Button>
          <Button type="submit" disabled={uploading}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
