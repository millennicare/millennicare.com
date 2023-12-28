"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { editChild } from "~/app/dashboard/_actions/child";
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
import { useToast } from "~/components/ui/use-toast";

interface Props {
  readonly child: {
    id: string;
    name: string;
    age: number;
  };
  setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  age: z.coerce.number().int().gte(0).lte(18),
  name: z.string(),
});

export default function EditChildForm({ child, setOpenEditForm }: Props) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: child.name,
      age: child.age,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = { ...values, childId: child.id };
      await editChild(data);
      setOpenEditForm(false);
    } catch (error) {
      console.error(error);
      if (error instanceof TRPCClientError) {
        toast({
          title: "Internal server error. Please try again later.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <>
      <h1>Edit child</h1>
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
