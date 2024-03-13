"use client";

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
import { z } from "zod";

import { SubmitButton } from "~/app/_components/submit-btn";
import { addChild } from "../actions";

interface Props {
  setOpenAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.coerce
    .number()
    .min(0, { message: "Age must be between 0 and 18." })
    .max(18, { message: "Age must be between 0 and 18." })
    .int(),
});

export default function AddChildForm({ setOpenAddForm }: Props) {
  const form = useForm({
    schema: schema,
    defaultValues: {
      name: "",
      age: 0,
    },
  });

  async function onSubmit(values: { name: string; age: number }) {
    try {
      await addChild({ name: values.name, age: values.age });

      setOpenAddForm(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1>Add child</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton value="Save" error={!form.formState.errors} />
        </form>
      </Form>
    </>
  );
}
