"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { addChild } from "~/app/dashboard/_actions/child";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface Props {
  setOpenAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  age: z.coerce.number().int().gte(0).lte(18),
  name: z.string(),
});

export default function AddChildForm({ setOpenAddForm }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

          <Button type="submit" size="lg">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
