"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import format from "date-fns/format";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import type { FormProps } from "../types";

interface AdditionalInfoFormProps extends FormProps {
  handleClerkSubmit: () => Promise<void>;
}

const zipCodeReg = new RegExp(/^\b\d{5}(-\d{4})?\b$/);

const formSchema = z.object({
  profilePicture: z.any(),
  birthdate: z.coerce.date(),
  biography: z.string().optional(),
  zipCode: z.string().regex(zipCodeReg),
});

export default function AdditionalInfoForm({
  formValues,
  setFormValues,
  handleBack,
  step,
  handleClerkSubmit,
}: AdditionalInfoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
    mode: "onSubmit",
  });
  const watchZipCode = form.watch("zipCode");

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [suggestedCity, setSuggestedCity] = useState("");

  useEffect(() => {
    async function getSuggestions() {
      try {
        const res = await fetch("/api/locations/get-suggestions", {
          method: "POST",
          body: JSON.stringify({ zipCode: watchZipCode }),
        });

        const json = (await res.json()) as string;
        setSuggestedCity(json);
      } catch (error) {
        console.log(error);
      }
    }

    if (zipCodeReg.test(watchZipCode)) {
      getSuggestions().catch((error) => console.error(error));
    } else {
      setSuggestedCity("");
    }
  }, [watchZipCode]);

  async function handleSave(values: z.infer<typeof formSchema>) {
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
          fileKey: string;
        };
        profileLink = json.fileKey;
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
    }));
    await handleClerkSubmit();
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
          name="zipCode"
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
        {suggestedCity ? (
          <p className="pt-0 text-sm italic">{suggestedCity}</p>
        ) : (
          <></>
        )}

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
