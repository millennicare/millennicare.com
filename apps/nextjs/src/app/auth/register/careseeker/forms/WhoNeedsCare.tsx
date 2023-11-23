"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { FormProps } from "../page";

const formSchema = z.object({
  children: z.array(
    z.object({
      name: z
        .string({ required_error: "Name required" })
        .min(1, "Name required"),
      age: z.coerce.number().int().gte(0).lte(18),
    }),
  ),
});

export default function WhoNeedsCareForm({
  formValues,
  setFormValues,
  handleBack,
  handleNext,
  step,
}: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // checks to see if 'children' field are already in and sets the default values
    defaultValues: {
      ...formValues,
      children:
        formValues.children.length !== 0
          ? formValues.children
          : [
              {
                name: "",
                age: 1,
              },
            ],
    },
    mode: "onSubmit",
  });
  const { fields, append, remove } = useFieldArray({
    name: "children",
    control: form.control,
  });

  function handleSave(values: z.infer<typeof formSchema>) {
    setFormValues((prev) => ({ ...prev, ...values }));
    handleNext();
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
        <ul>
          {fields.map((item, index) => (
            <li key={item.id} className={`flex space-x-2`}>
              <FormField
                control={form.control}
                name={`children.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`children.${index}.age`}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Age" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="destructive"
                type="button"
                onClick={() => remove(index)}
                className="self-end"
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
        <div>
          <Button
            variant="link"
            className="p-0"
            onClick={() => append({ name: "", age: 0 })}
          >
            Add child
          </Button>
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
          >
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
